# AgriSmart Backend

Complete backend system for AgriSmart with API services, authentication, real-time chat, and ML prediction models.

## Structure

```
backend/
├── src/                    # Node.js API server
│   ├── server.js          # Main Express server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Utilities
├── ml/                     # Machine Learning services
│   ├── main.py           # FastAPI ML server
│   └── requirements.txt  # Python dependencies
└── package.json          # Node.js dependencies
```

## Setup

### 1. Environment Configuration
Copy `.env.example` to `.env` and fill in values:

```bash
MONGODB_URI=mongodb+srv://akashkoravena8_db_user:<db_password>@cluster0.fi5nhkd.mongodb.net/agrismart?retryWrites=true&w=majority
JWT_SECRET=change-me
PORT=5000
```

### 2. Node.js Dependencies
Install Node.js dependencies:

```bash
cd backend
npm install
```

### 3. Python ML Dependencies
Install Python dependencies for ML services:

```bash
cd backend/ml
pip install -r requirements.txt
```

## Running the Services

### Option 1: Run All Services Together
```bash
npm run dev:all    # Development mode with hot reload
npm run start:all  # Production mode
```

### Option 2: Run Services Separately
```bash
# Node.js API Server
npm run dev        # Development
npm run start      # Production

# ML Service
npm run ml         # Python FastAPI server
```

### Option 3: Individual Service Startup
```bash
# API Server only
node src/server.js

# ML Server only
cd ml && python main.py
```

## Service Endpoints

### API Server (Port 5000)
- **Authentication**: `/api/auth/*`
- **User Management**: `/api/admin/*`
- **Chat**: Socket.io real-time messaging
- **Marketplace**: `/api/market/*`
- **Analytics**: `/api/analytics/*`

### ML Service (Port 8000)
- **Crop Prediction**: `/predict/crop`
- **Disease Detection**: `/predict/disease`
- **Yield Estimation**: `/predict/yield`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin Management
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Chat (Socket.io)
- Real-time messaging between users
- Online status tracking
- Typing indicators

## ML Models

### Crop Prediction
- Input: Soil type, climate, location, farm size
- Output: Recommended crops with confidence scores

### Disease Detection
- Input: Plant images or symptoms
- Output: Disease identification and treatment recommendations

### Yield Estimation
- Input: Crop type, growing conditions, farm data
- Output: Predicted yield with confidence intervals

## Development

### API Server Development
```bash
npm run dev  # Runs with --watch for auto-restart
```

### ML Service Development
```bash
cd ml
python main.py  # Runs FastAPI with auto-reload
```

## Database

Uses MongoDB for:
- User management and authentication
- Chat message history
- Marketplace listings
- Analytics data

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT
- **ML Services**: Python, FastAPI, scikit-learn
- **API Documentation**: Built-in FastAPI docs

## Ports

- **API Server**: http://localhost:5000
- **ML Service**: http://localhost:8000
- **Frontend**: http://localhost:5173

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `PORT`: API server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

