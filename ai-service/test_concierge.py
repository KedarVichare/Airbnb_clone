"""
Test script for AI Concierge Agent
Run this to test the service is working correctly
"""

import httpx
import json
import asyncio

API_URL = "http://localhost:8000"

async def test_health():
    """Test health endpoint"""
    print("\n🔍 Testing Health Endpoint...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_URL}/health")
            print(f"✅ Status: {response.status_code}")
            print(f"📋 Response: {response.json()}")
            return True
        except Exception as e:
            print(f"❌ Error: {e}")
            return False

async def test_concierge():
    """Test AI Concierge endpoint"""
    print("\n🔍 Testing AI Concierge Endpoint...")
    
    test_request = {
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
        "free_text_query": "Looking for family-friendly activities with vegetarian dining options"
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            print(f"\n📤 Sending request...")
            print(f"Location: {test_request['booking_context']['location']}")
            print(f"Dates: {test_request['booking_context']['dates']}")
            print(f"Party: {test_request['booking_context']['party_type']}")
            print(f"Interests: {test_request['preferences']['interests']}")
            
            response = await client.post(f"{API_URL}/ai-concierge", json=test_request)
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n✅ Success! Status: {response.status_code}")
                print(f"\n📊 Results Summary:")
                print(f"   • Day Plans: {len(data.get('day_by_day_plan', []))} days")
                print(f"   • Activities: {len(data.get('activity_cards', []))} activities")
                print(f"   • Restaurants: {len(data.get('restaurant_recommendations', []))} restaurants")
                print(f"   • Packing Items: {len(data.get('packing_checklist', []))} items")
                print(f"   • Local Events: {len(data.get('local_events', []))} events")
                
                # Show first activity
                if data.get('activity_cards'):
                    activity = data['activity_cards'][0]
                    print(f"\n🎯 Sample Activity:")
                    print(f"   Title: {activity['title']}")
                    print(f"   Address: {activity['address']}")
                    print(f"   Price: {activity['price_tier']}")
                    print(f"   Duration: {activity['duration']}")
                
                # Show first restaurant
                if data.get('restaurant_recommendations'):
                    restaurant = data['restaurant_recommendations'][0]
                    print(f"\n🍽️  Sample Restaurant:")
                    print(f"   Name: {restaurant['name']}")
                    print(f"   Cuisine: {restaurant['cuisine_type']}")
                    print(f"   Price: {restaurant['price_tier']}")
                    print(f"   Dietary: {', '.join(restaurant['dietary_accommodations'])}")
                
                # Show local events
                if data.get('local_events'):
                    print(f"\n🎉 Local Events:")
                    for event in data['local_events'][:3]:
                        print(f"   • {event['name']} - {event.get('date', 'TBD')}")
                
                # Show weather
                if data.get('weather_info'):
                    print(f"\n🌤️  Weather Forecast:")
                    for day in data['weather_info']['forecast'][:3]:
                        print(f"   {day['date']}: {day['temp']} - {day['condition']}")
                
                return True
            else:
                print(f"❌ Error! Status: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return False

async def main():
    print("=" * 60)
    print("🤖 AI Concierge Agent - Test Suite")
    print("=" * 60)
    
    # Test health
    health_ok = await test_health()
    
    if not health_ok:
        print("\n⚠️  Service appears to be offline. Please start the service first:")
        print("   cd ai-service")
        print("   venv\\Scripts\\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000")
        return
    
    # Test concierge
    concierge_ok = await test_concierge()
    
    print("\n" + "=" * 60)
    if health_ok and concierge_ok:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())

