# Tavily Web Search Integration

## Overview

The AI Concierge Agent now integrates **Tavily Web Search API** to provide real-time local information about events, activities, and attractions in the destination city.

## Features

✅ **Real-time Local Events**: Dynamically searches for events happening during travel dates
✅ **Fallback Mechanism**: Uses mock data if Tavily API is unavailable or API key is missing
✅ **Async Implementation**: Non-blocking HTTP requests for better performance
✅ **Error Handling**: Graceful degradation if search fails

## How It Works

### 1. **Search Function** (Lines 150-176 in main.py)

```python
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
```

### 2. **Local Events Integration** (Lines 195-226 in main.py)

```python
async def get_local_events(location: str, dates: str) -> List[Dict[str, Any]]:
    """Fetch local events dynamically via Tavily"""
    query = f"local events happening in {location} during {dates}"
    tavily_results = await search_tavily(query)

    if not tavily_results:
        # Fallback to mock data
        return [...]

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
```

## Setup Instructions

### 1. Get Tavily API Key

1. Visit [https://www.tavily.com](https://www.tavily.com)
2. Sign up for a free account
3. Navigate to your API dashboard
4. Copy your API key

### 2. Configure Environment

Create or update your `.env` file in the `ai-service` directory:

```bash
# Copy the example file
cp env.example .env

# Add your Tavily API key
TAVILY_API_KEY=your_actual_tavily_api_key_here
```

### 3. Test the Integration

The service will automatically use Tavily for local events when:
- A valid `TAVILY_API_KEY` is present in `.env`
- The API is accessible and responsive

If Tavily is not available, the service gracefully falls back to mock data.

## API Response Format

When Tavily integration is active, the `/ai-concierge` endpoint returns:

```json
{
  "day_by_day_plan": [...],
  "activity_cards": [...],
  "restaurant_recommendations": [...],
  "packing_checklist": [...],
  "weather_info": {...},
  "local_events": [
    {
      "name": "San Jose Jazz Festival",
      "date": "2025-10-02",
      "location": "San Jose, CA",
      "description": "Annual jazz festival featuring local and international artists...",
      "url": "https://example.com/event"
    }
  ]
}
```

## Use Cases

### 1. **Dynamic Event Discovery**
```python
# Query: "local events happening in San Jose, CA during 2025-10-01 to 2025-10-05"
# Returns: Real-time events, festivals, concerts, markets, etc.
```

### 2. **Activity Recommendations**
Can be extended to search for:
- Popular attractions
- Restaurant reviews
- Points of interest
- Seasonal activities
- Local tours

### 3. **Real-time Information**
- Current events and happenings
- Temporary exhibitions
- Special seasonal activities
- Local festivals and celebrations

## Extending Tavily Integration

You can enhance the integration by adding more search queries:

```python
# Search for restaurants
async def search_restaurants(location: str, preferences: TravelerPreferences):
    dietary = ", ".join(preferences.dietary_filters)
    query = f"best {dietary} restaurants in {location}"
    return await search_tavily(query)

# Search for activities
async def search_activities(location: str, interests: List[str]):
    interest_str = ", ".join(interests)
    query = f"best {interest_str} activities and attractions in {location}"
    return await search_tavily(query)

# Search for weather
async def search_weather(location: str, dates: str):
    query = f"weather forecast {location} {dates}"
    return await search_tavily(query)
```

## Benefits

✅ **Real-time Data**: Always up-to-date information
✅ **Comprehensive Coverage**: Tavily indexes multiple sources
✅ **Intelligent Search**: AI-powered search ranking
✅ **Reliable**: Built-in fallback mechanism
✅ **Fast**: Async implementation for quick responses

## Troubleshooting

### Issue: "TAVILY_API_KEY not found"
**Solution**: Add your API key to the `.env` file

### Issue: "Tavily API error"
**Solution**: 
- Check your API key validity
- Verify internet connection
- Check API rate limits
- Service will use fallback mock data automatically

### Issue: No events returned
**Solution**:
- Try a more general query
- Check the date format
- Verify location spelling
- Service will use fallback mock data

## Rate Limits

Tavily free tier typically includes:
- 1,000 searches per month
- Rate limit: ~10 requests per second

Monitor your usage at: https://www.tavily.com/dashboard

## Security Notes

⚠️ **Never commit your `.env` file to version control**
⚠️ **Keep your API key secure**
⚠️ **Use environment variables in production**

## Future Enhancements

- [ ] Cache Tavily results to reduce API calls
- [ ] Implement more specific search queries
- [ ] Add sentiment analysis for event recommendations
- [ ] Integrate with multiple data sources
- [ ] Add user feedback loop for better recommendations

