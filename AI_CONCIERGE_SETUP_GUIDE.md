# 🤖 AI Concierge Agent - Complete Setup Guide

## 📋 Overview

The AI Concierge Agent is a Python FastAPI service integrated with your Airbnb application that provides personalized travel recommendations. It includes:

- **Day-by-day itinerary planning**
- **Activity recommendations** with accessibility information
- **Restaurant suggestions** filtered by dietary preferences
- **Weather-aware packing lists**
- **Real-time local events** via Tavily Web Search API

---

## ✅ What's Been Implemented

### Backend (Python FastAPI)
- ✅ Complete REST API service (`ai-service/main.py`)
- ✅ POST `/ai-concierge` endpoint for recommendations
- ✅ GET `/health` endpoint for service monitoring
- ✅ **Tavily Web Search Integration** for real-time local events
- ✅ Async HTTP client for non-blocking requests
- ✅ Error handling and graceful fallbacks
- ✅ CORS configured for frontend integration

### Frontend (React)
- ✅ AI Concierge floating button (bottom-right corner)
- ✅ Right-side panel with comprehensive preference form
- ✅ Results display with tabbed interface:
  - Day-by-Day Itinerary
  - Activities
  - Restaurants
  - Packing List
- ✅ Weather forecast display
- ✅ Local events showcase
- ✅ Service integration via `AIConciergeService.js`

### Documentation
- ✅ Complete README for AI service
- ✅ Tavily integration documentation
- ✅ Test script for verification
- ✅ Startup scripts for Windows and Linux

---

## 🚀 Quick Start

### 1. **Install Python Dependencies**

```bash
cd ai-service

# Create virtual environment (if not done)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Install all dependencies
pip install uvicorn fastapi pydantic python-dotenv httpx
```

### 2. **Configure Tavily API (Optional)**

```bash
# Copy environment template
copy env.example .env

# Edit .env and add your Tavily API key
TAVILY_API_KEY=your_tavily_api_key_here
```

**Get Tavily API Key:**
1. Visit https://www.tavily.com
2. Sign up for free account
3. Get API key from dashboard

**Note:** Service works without Tavily (uses mock data), but real-time events require the API key.

### 3. **Start AI Service**

```bash
# From ai-service directory
venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or use the startup script:
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

Service will run on: **http://localhost:8000**

### 4. **Start Frontend**

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:5173**

### 5. **Test the Service**

Open browser to `http://localhost:5173` and:
1. Click the purple **"AI Concierge"** button (bottom-right)
2. Fill in the travel details form
3. Click **"Get Recommendations"**
4. View your personalized itinerary!

---

## 📊 Service Endpoints

### Health Check
```bash
GET http://localhost:8000/health

Response:
{
  "status": "healthy",
  "service": "AI Concierge Agent"
}
```

### AI Concierge
```bash
POST http://localhost:8000/ai-concierge

Request Body:
{
  "booking_context": {
    "dates": "2025-11-01 to 2025-11-05",
    "location": "San Jose, CA",
    "party_type": "family"
  },
  "preferences": {
    "budget": "medium",
    "interests": ["technology", "nature"],
    "mobility_needs": "none",
    "dietary_filters": ["vegetarian"],
    "children": 2
  },
  "free_text_query": "Looking for family-friendly activities"
}

Response:
{
  "day_by_day_plan": [...],
  "activity_cards": [...],
  "restaurant_recommendations": [...],
  "packing_checklist": [...],
  "weather_info": {...},
  "local_events": [...]
}
```

---

## 🎯 Features in Detail

### 1. **Day-by-Day Planning**
- Organizes activities into morning, afternoon, and evening blocks
- Filters based on mobility needs and child-friendliness
- Shows duration and pricing for each activity

### 2. **Activity Cards**
- Title, address, and location
- Price tier ($, $$, $$$)
- Duration estimates
- Tags (culture, nature, technology, etc.)
- Wheelchair accessible indicator
- Child-friendly indicator

### 3. **Restaurant Recommendations**
- Filtered by dietary preferences (vegan, vegetarian, gluten-free, etc.)
- Cuisine type
- Price tier
- Rating
- Address and location

### 4. **Packing Checklist**
- Weather-aware recommendations
- Categorized items (clothing, electronics, documents, etc.)
- Child-specific items if children are in party
- Weather-dependent items (umbrella for rain, etc.)

### 5. **Weather Forecast**
- 5-day forecast display
- Temperature and conditions
- Visual weather icons

### 6. **Local Events (Tavily Integration)**
- Real-time event search
- Event name, date, location
- Description and URLs
- Fallback to mock data if API unavailable

---

## 🔧 Tavily Integration Details

### How It Works

The service uses **Tavily Web Search API** to find real-time local information:

```python
async def search_tavily(query: str, max_results: int = 5):
    """Use Tavily for real-time local data"""
    # Searches the web for local events, activities, etc.
    # Returns structured results with title, URL, and snippets
```

### Example Queries
- `"local events happening in San Jose, CA during 2025-11-01 to 2025-11-05"`
- `"best vegetarian restaurants in San Jose"`
- `"family-friendly activities in San Jose"`

### Fallback Mechanism
If Tavily API is unavailable or API key is missing:
- Service automatically falls back to mock data
- No errors shown to users
- Graceful degradation

---

## 📁 Project Structure

```
Lab1_Airbnb/
├── ai-service/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   ├── env.example               # Environment template
│   ├── .env                       # Your API keys (create this)
│   ├── README.md                  # Service documentation
│   ├── TAVILY_INTEGRATION.md     # Tavily docs
│   ├── test_concierge.py         # Test script
│   ├── start.bat                  # Windows startup
│   ├── start.sh                   # Linux/Mac startup
│   └── venv/                      # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIConcierge.jsx         # Button & Panel
│   │   │   └── ConciergeResults.jsx    # Results display
│   │   ├── services/
│   │   │   └── AIConciergeService.js   # API client
│   │   └── pages/
│   │       └── Home.jsx                 # Integrated UI
│   └── ...
│
└── backend/
    └── ... (your existing Node.js backend)
```

---

## 🧪 Testing

### Option 1: Manual Testing via Browser
1. Start both services (AI service + Frontend)
2. Open http://localhost:5173
3. Click AI Concierge button
4. Fill form and submit

### Option 2: API Testing via Script
```bash
cd ai-service
venv\Scripts\python.exe test_concierge.py
```

### Option 3: Direct API Call
```bash
# Using PowerShell
$body = @{
    booking_context = @{
        dates = "2025-11-01 to 2025-11-05"
        location = "San Jose, CA"
        party_type = "family"
    }
    preferences = @{
        budget = "medium"
        interests = @("technology", "nature")
        children = 2
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/ai-concierge" -Method Post -Body $body -ContentType "application/json"
```

---

## 🎨 UI Features

### AI Concierge Button
- **Location**: Fixed bottom-right corner
- **Design**: Purple gradient with "AI" icon
- **Behavior**: Opens right-side panel on click

### Preference Form
- Booking details (dates, location, party type)
- Budget selection
- Interest checkboxes (8 categories)
- Mobility needs dropdown
- Children count
- Dietary preferences (6 options)
- Free-text query field

### Results Display
- **Tabbed Interface**: 4 tabs
  1. Day-by-Day Plan
  2. Activities
  3. Restaurants
  4. Packing List
- **Weather Card**: Shows 5-day forecast
- **Events Card**: Local happenings
- **Visual Icons**: Weather, wheelchair, child-friendly indicators

---

## 📝 Current Limitations & Future Enhancements

### Current Mock Data Locations
- San Jose, CA (full data)
- Other locations use fallback data

### Future Enhancements
- [ ] Add more city data
- [ ] Integrate real weather API
- [ ] Add Google Places for restaurants
- [ ] Implement activity booking
- [ ] User preference storage
- [ ] ML-based personalization
- [ ] Multi-language support
- [ ] Mobile app version

---

## 🛠️ Troubleshooting

### Service Won't Start
```
Error: "No module named uvicorn"
Solution: pip install uvicorn httpx fastapi pydantic python-dotenv
```

### Frontend Can't Connect
```
Error: "Unable to connect to AI Concierge service"
Solution: Ensure AI service is running on port 8000
Check: http://localhost:8000/health
```

### No Events Showing
```
Issue: Local events showing mock data
Solution: Add TAVILY_API_KEY to .env file
Note: Service works without it, just uses mock data
```

### CORS Errors
```
Error: CORS policy blocking requests
Solution: Check frontend URL in main.py CORS settings
Verify: Frontend URL matches allowed origins
```

---

## 📞 Support & Resources

- **Tavily API Docs**: https://docs.tavily.com
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Icons**: https://react-icons.github.io/react-icons

---

## ✨ Summary

You now have a fully functional AI Concierge Agent that:
- ✅ Accepts user preferences via beautiful UI
- ✅ Generates personalized itineraries
- ✅ Provides real-time local event information (with Tavily)
- ✅ Creates weather-aware packing lists
- ✅ Filters restaurants by dietary needs
- ✅ Shows wheelchair-accessible activities
- ✅ Handles family travel with kids

**Services to Run:**
1. AI Service: `http://localhost:8000`
2. Frontend: `http://localhost:5173`
3. Backend (existing): `http://localhost:5000`

**Ready to test!** 🎉

