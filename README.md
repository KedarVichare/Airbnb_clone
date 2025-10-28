# Airbnb Clone Project

## Overview
This project is a full-stack Airbnb clone featuring property search, booking, owner/traveler profile management, and an AI-powered concierge. It uses a modern web stack with React, Node.js/Express, Python FastAPI, and MySQL.


- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Agent Service**: Python FastAPI, Langchain
- **Database**: MySQL

## Features
- Property search and filtering
- Booking management (traveler and owner views)
- Owner and traveler profile management
- AI Concierge (weather, POIs, itinerary)
- Responsive UI

## Folder Structure
```
ai-service/      # Python FastAPI agent service
backend/         # Node.js/Express backend API
frontend/        # React frontend (Vite)
```

## Getting Started
### Prerequisites
- Node.js & npm
- Python 3.10+
- MySQL

### Setup
1. **Install dependencies**
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
   - Agent Service: `cd ai-service && pip install -r requirements.txt`
2. **Configure Database**
   - Create MySQL database and import `backend/dump.sql`
   - Update DB config in `backend/src/config/db.js`
3. **Run Services**
   - Backend: `cd backend && node server.js`
   - Frontend: `cd frontend && npm run dev`
   - Agent Service: `cd ai-service && uvicorn main:app --reload`
   - mysql: `mysql -u root -p`

## API Endpoints
- `/api/users` - User profile management
- `/api/properties` - Property search/listing
- `/api/bookings` - Booking management
- `/api/concierge` - AI concierge requests

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit changes and open a PR

## License
MIT

## Credits
- React, Node.js, Express, FastAPI, Langchain, MySQL
