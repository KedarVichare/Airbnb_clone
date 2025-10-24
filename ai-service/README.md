# AI Concierge Agent Service

This is a Python FastAPI service that provides personalized travel recommendations for Airbnb users. It generates day-by-day itineraries, activity recommendations, restaurant suggestions, and weather-aware packing lists.

## Features

- **Day-by-Day Planning**: Creates detailed itineraries with morning, afternoon, and evening activities
- **Activity Cards**: Provides activity recommendations with accessibility and family-friendly information
- **Restaurant Recommendations**: Suggests restaurants based on dietary preferences and location
- **Packing Checklist**: Generates weather-aware packing lists
- **Weather Integration**: Includes weather forecasts for travel dates
- **Local Events**: Shows local events happening during the travel period
- **Natural Language Support**: Accepts free-text queries for additional preferences

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Navigate to the ai-service directory:
   ```bash
   cd ai-service
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Edit the `.env` file and add your API keys (optional for basic functionality).

### Running the Service

#### Option 1: Using the startup script
- On Windows: Double-click `start.bat` or run `start.bat` in command prompt
- On macOS/Linux: Run `./start.sh` in terminal

#### Option 2: Manual startup
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at `http://localhost:8000`

### API Endpoints

#### POST /ai-concierge
Main endpoint for getting travel recommendations.

**Request Body:**
```json
{
  "booking_context": {
    "dates": "2025-10-01 to 2025-10-05",
    "location": "San Jose, CA",
    "party_type": "family"
  },
  "preferences": {
    "budget": "medium",
    "interests": ["culture", "nature"],
    "mobility_needs": "none",
    "dietary_filters": ["vegan"],
    "children": 2
  },
  "free_text_query": "we're vegan, no long hikes, two kids"
}
```

**Response:**
```json
{
  "day_by_day_plan": [...],
  "activity_cards": [...],
  "restaurant_recommendations": [...],
  "packing_checklist": [...],
  "weather_info": {...},
  "local_events": [...]
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Concierge Agent"
}
```

### Integration with Frontend

The React frontend connects to this service through the `AIConciergeService` class located in `frontend/src/services/AIConciergeService.js`.

### Development Notes

- The service currently uses mock data for demonstrations
- In production, integrate with real APIs for:
  - Weather data (OpenWeatherMap, WeatherAPI)
  - Local events (Eventbrite, Facebook Events)
  - Restaurant data (Yelp, Google Places)
  - Activity recommendations (TripAdvisor, Foursquare)
- Consider adding LangChain integration for more sophisticated AI recommendations
- Add authentication and rate limiting for production use

### Troubleshooting

1. **Port 8000 already in use**: Change the port in the startup command or kill the process using port 8000
2. **Module not found errors**: Ensure virtual environment is activated and dependencies are installed
3. **CORS errors**: Check that the frontend URL is included in the CORS origins list in `main.py`

### Future Enhancements

- Integration with OpenAI GPT for more intelligent recommendations
- Real-time web search using Tavily API
- Database integration for storing user preferences
- Machine learning for personalized recommendations
- Multi-language support
- Integration with booking systems
