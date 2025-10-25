from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import httpx
import logging
from dotenv import load_dotenv

load_dotenv(dotenv_path="../backend/.env")

YELP_API_KEY = os.getenv("YELP_API_KEY")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="AI Concierge Agent", version="1.1.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Pydantic Models
# -----------------------------

class BookingContext(BaseModel):
    dates: str  # "2025-10-01 to 2025-10-05"
    location: str  # "San Jose, CA"
    party_type: str  # "family", "couple", "solo", "group"

class TravelerPreferences(BaseModel):
    budget: Optional[str] = "medium"
    interests: Optional[List[str]] = []
    mobility_needs: Optional[str] = "none"
    dietary_filters: Optional[List[str]] = []
    children: Optional[int] = 0

class ConciergeRequest(BaseModel):
    booking_context: BookingContext
    preferences: TravelerPreferences
    free_text_query: Optional[str] = None

class ActivityCard(BaseModel):
    title: str
    address: str
    price_tier: str
    duration: str
    tags: List[str]
    wheelchair_friendly: bool
    child_friendly: bool

class RestaurantRecommendation(BaseModel):
    name: str
    address: str
    cuisine_type: str
    price_tier: str
    dietary_accommodations: List[str]
    rating: float

class PackingItem(BaseModel):
    item: str
    category: str
    weather_dependent: bool

class DayPlan(BaseModel):
    date: str
    morning: List[ActivityCard]
    afternoon: List[ActivityCard]
    evening: List[ActivityCard]

class ConciergeResponse(BaseModel):
    day_by_day_plan: List[DayPlan]
    activity_cards: List[ActivityCard]
    restaurant_recommendations: List[RestaurantRecommendation]
    packing_checklist: List[PackingItem]
    weather_info: Optional[Dict[str, Any]] = None
    local_events: Optional[List[Dict[str, Any]]] = None


# -----------------------------
# Mock Data
# -----------------------------

MOCK_ACTIVITIES = {
    "San Jose, CA": [
        {
            "title": "Tech Museum of Innovation",
            "address": "201 S Market St, San Jose, CA 95113",
            "price_tier": "$$",
            "duration": "2-3 hours",
            "tags": ["technology", "family", "educational"],
            "wheelchair_friendly": True,
            "child_friendly": True
        },
        {
            "title": "Santana Row Shopping",
            "address": "377 Santana Row, San Jose, CA 95128",
            "price_tier": "$$$",
            "duration": "3-4 hours",
            "tags": ["shopping", "dining", "entertainment"],
            "wheelchair_friendly": True,
            "child_friendly": True
        },
        {
            "title": "Alum Rock Park Hiking",
            "address": "15350 Penitencia Creek Rd, San Jose, CA 95127",
            "price_tier": "$",
            "duration": "2-4 hours",
            "tags": ["nature", "hiking", "outdoor"],
            "wheelchair_friendly": False,
            "child_friendly": True
        }
    ]
}

MOCK_RESTAURANTS = {
    "San Jose, CA": [
        {
            "name": "Orchard City Kitchen",
            "address": "1875 S Bascom Ave, Campbell, CA 95008",
            "cuisine_type": "American",
            "price_tier": "$$",
            "dietary_accommodations": ["vegetarian", "vegan", "gluten-free"],
            "rating": 4.2
        },
        {
            "name": "La Victoria Taqueria",
            "address": "140 E San Carlos St, San Jose, CA 95112",
            "cuisine_type": "Mexican",
            "price_tier": "$",
            "dietary_accommodations": ["vegetarian"],
            "rating": 4.0
        }
    ]
}

async def get_restaurants_from_yelp(location: str, dietary_filters: list[str], limit: int = 5):
    """Fetch real restaurants dynamically from Yelp API"""
    if not YELP_API_KEY:
        print("⚠️  Yelp API key missing in .env")
        return []

    term = "restaurants"
    if dietary_filters:
        term += " " + " ".join(dietary_filters)  # e.g., "restaurants vegan gluten-free"

    url = "https://api.yelp.com/v3/businesses/search"
    headers = {"Authorization": f"Bearer {YELP_API_KEY}"}
    params = {
        "term": term,
        "location": location,
        "limit": limit,
        "sort_by": "rating"
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            restaurants = []
            for r in data.get("businesses", []):
                restaurants.append({
                    "name": r.get("name"),
                    "address": " ".join(r.get("location", {}).get("display_address", [])),
                    "cuisine_type": ", ".join(r.get("categories", [{}])[0].get("title", "")),
                    "price_tier": r.get("price", "?"),
                    "dietary_accommodations": dietary_filters,
                    "rating": r.get("rating", 0.0)
                })
            return restaurants
    except Exception as e:
        print("❌ Yelp API error:", e)
        return []

# -----------------------------
# Tavily Web Search Integration
# -----------------------------

async def search_tavily(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Use Tavily Web Search API for real-time local data"""
    tavily_api_key = os.getenv("TAVILY_API_KEY")
    if not tavily_api_key:
        logger.warning("TAVILY_API_KEY not found in .env")
        return []

    tavily_url = "https://api.tavily.com/search"
    payload = {
        "api_key": tavily_api_key,
        "query": query,
        "max_results": max_results
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(tavily_url, json=payload)
            response.raise_for_status()
            data = response.json()
            return [
                {"title": r.get("title"), "url": r.get("url"), "snippet": r.get("content")}
                for r in data.get("results", [])
            ]
    except Exception as e:
        logger.error(f"Tavily API error: {e}")
        return []


# -----------------------------
# Helper Functions
# -----------------------------

def get_weather_info(location: str, dates: str) -> Dict[str, Any]:
    """Mock weather function - Replace with real API if desired"""
    return {
        "location": location,
        "forecast": [
            {"date": "2025-10-01", "temp": "75°F", "condition": "Sunny"},
            {"date": "2025-10-02", "temp": "78°F", "condition": "Partly Cloudy"},
            {"date": "2025-10-03", "temp": "72°F", "condition": "Cloudy"},
            {"date": "2025-10-04", "temp": "70°F", "condition": "Light Rain"},
            {"date": "2025-10-05", "temp": "76°F", "condition": "Sunny"}
        ]
    }

async def get_local_events(location: str, dates: str) -> List[Dict[str, Any]]:
    """Fetch local events dynamically via Tavily"""
    query = f"local events happening in {location} during {dates}"
    tavily_results = await search_tavily(query)

    if not tavily_results:
        # Fallback mock data
        return [
            {
                "name": "San Jose Jazz Festival",
                "date": "2025-10-02",
                "location": "Plaza de César Chávez",
                "description": "Annual jazz festival featuring local and international artists"
            },
            {
                "name": "Farmers Market",
                "date": "2025-10-04",
                "location": "San Pedro Square",
                "description": "Weekly farmers market with local produce and crafts"
            }
        ]

    return [
        {
            "name": r["title"],
            "date": dates.split(" to ")[0],
            "location": location,
            "description": r.get("snippet", ""),
            "url": r.get("url")
        }
        for r in tavily_results
    ]


def generate_packing_checklist(weather_info: Dict[str, Any], preferences: TravelerPreferences) -> List[PackingItem]:
    """Generate weather-aware packing checklist"""
    checklist = [
        PackingItem(item="Clothes for trip", category="clothing", weather_dependent=True),
        PackingItem(item="Toiletries", category="personal", weather_dependent=False),
        PackingItem(item="Phone charger", category="electronics", weather_dependent=False),
        PackingItem(item="Travel documents", category="documents", weather_dependent=False),
    ]

    for forecast in weather_info.get("forecast", []):
        if "rain" in forecast["condition"].lower():
            checklist.append(PackingItem(item="Umbrella", category="weather", weather_dependent=True))
            break

    if preferences.children and preferences.children > 0:
        checklist.extend([
            PackingItem(item="Child snacks", category="food", weather_dependent=False),
            PackingItem(item="Entertainment for kids", category="activities", weather_dependent=False),
        ])

    return checklist


def create_day_plan(date: str, location: str, preferences: TravelerPreferences) -> DayPlan:
    """Create a daily plan"""
    activities = MOCK_ACTIVITIES.get(location, [])
    filtered = []

    for activity in activities:
        if preferences.mobility_needs == "wheelchair" and not activity["wheelchair_friendly"]:
            continue
        filtered.append(ActivityCard(**activity))

    morning = filtered[:1]
    afternoon = filtered[1:2]
    evening = filtered[2:3]

    return DayPlan(date=date, morning=morning, afternoon=afternoon, evening=evening)


# -----------------------------
# API Endpoints
# -----------------------------

@app.post("/ai-concierge", response_model=ConciergeResponse)
async def ai_concierge_agent(request: ConciergeRequest):
    """Main endpoint for personalized travel recommendations"""
    try:
        logger.info(f"Generating itinerary for {request.booking_context.location}")

        start_date, end_date = request.booking_context.dates.split(" to ")
        weather_info = get_weather_info(request.booking_context.location, request.booking_context.dates)
        local_events = await get_local_events(request.booking_context.location, request.booking_context.dates)

        # Build daily plans
        day_plans = []
        current_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")

        while current_date <= end_date_obj:
            plan = create_day_plan(current_date.strftime("%Y-%m-%d"), request.booking_context.location, request.preferences)
            day_plans.append(plan)
            current_date += timedelta(days=1)

        all_activities = [a for plan in day_plans for a in (plan.morning + plan.afternoon + plan.evening)]

        # Filter restaurants
        restaurants = await get_restaurants_from_yelp(
            request.booking_context.location,
            request.preferences.dietary_filters
        )
        restaurant_recs = [RestaurantRecommendation(**r) for r in restaurants]

        packing_checklist = generate_packing_checklist(weather_info, request.preferences)

        return ConciergeResponse(
            day_by_day_plan=day_plans,
            activity_cards=all_activities,
            restaurant_recommendations=restaurant_recs,
            packing_checklist=packing_checklist,
            weather_info=weather_info,
            local_events=local_events
        )

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")


@app.get("/health")
async def health_check():
    """Simple health check"""
    return {"status": "healthy", "service": "AI Concierge Agent"}


# -----------------------------
# Run the server
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
