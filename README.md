# AgriSmart - Agricultural Management System

A comprehensive agricultural management platform with role-based access, real-time chat, multi-language support, and ML-powered crop predictions.

## 🌾 Features

### Core Features
- **Role-Based Authentication**: Admin, Farmer, and Doctor roles
- **Multi-Language Support**: English and Hindi translations
- **Real-Time Chat**: Socket.io powered messaging system
- **Login-First Architecture**: Secure authentication flow
- **Responsive Design**: Mobile-friendly interface

### Advanced Features
- **ML Crop Prediction**: AI-powered crop recommendations
- **Disease Detection**: Plant health analysis
- **Marketplace**: Agricultural product trading
- **Analytics Dashboard**: Data insights and reporting
- **Consultation System**: Farmer-Doctor interactions

## 📁 Project Structure

```
AgriSmart/
├── frontend/              # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Language context
│   │   └── App.tsx       # Main application
│   └── package.json      # Frontend dependencies
└── backend/               # Unified backend services
    ├── src/              # Node.js API server
    │   ├── models/       # MongoDB models
    │   ├── routes/       # API routes
    │   └── server.js     # Express server
    ├── ml/               # Machine Learning services
    │   ├── main.py       # FastAPI ML server
    │   └── requirements.txt
    └── package.json      # Backend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AgriSmart
```

2. **Setup Frontend**
```bash
cd frontend
npm install
```

3. **Setup Backend**
```bash
cd backend
npm install
```

4. **Setup ML Services**
```bash
cd backend/ml
pip install -r requirements.txt
```

5. **Environment Configuration**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### Running the Application

#### Option 1: Run All Services
```bash
# Backend (API + ML)
cd backend
npm run dev:all

# Frontend (new terminal)
cd frontend
npm run dev
```

#### Option 2: Run Services Separately
```bash
# API Server
cd backend
npm run dev

# ML Server (new terminal)
cd backend/ml
python main.py

# Frontend (new terminal)
cd frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:5000
- **ML Service**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 👥 User Roles & Access

### Admin
- **Credentials**: admin.farms@gmail.com / agrismart2026
- **Access**: Full system management
- **Features**: User management, system monitoring, analytics

### Farmer
- **Access**: Crop management, marketplace, consultations
- **Features**: Crop prediction, disease detection, chat with doctors

### Doctor
- **Access**: Patient management, consultations
- **Features**: Case history, treatment plans, chat with farmers

## 🔧 Technologies

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time features
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing

### ML Services
- **Python** with FastAPI
- **scikit-learn** for ML models
- **NumPy** for data processing
- **Pydantic** for data validation

## 🌍 Multi-Language Support

The application supports:
- **English** (en): Complete UI translation
- **Hindi** (hi): Full Hindi translation for Indian farmers

Language switching is available throughout the application with persistent user preferences.

## 💬 Real-Time Features

- **Chat System**: Instant messaging between users
- **Online Status**: Real-time user presence
- **Typing Indicators**: See when others are typing
- **Message History**: Persistent chat storage

## 🤖 Machine Learning Models

### Crop Prediction
- **Input**: Soil type, climate, location, farm size
- **Output**: Crop recommendations with confidence scores

### Disease Detection
- **Input**: Plant images or symptom descriptions
- **Output**: Disease identification and treatment recommendations

### Yield Estimation
- **Input**: Crop type, growing conditions, historical data
- **Output**: Yield predictions with confidence intervals

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Permission-based features
- **Password Hashing**: bcryptjs encryption
- **CORS Protection**: Cross-origin security
- **Input Validation**: Comprehensive data validation

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Chat (Socket.io)
- Real-time messaging
- Online status tracking
- Typing indicators

### ML Predictions
- `POST /predict/crop` - Crop recommendations
- `POST /predict/disease` - Disease detection
- `POST /predict/yield` - Yield estimation

## 🎯 Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev     # Hot reload development
npm run build   # Production build
npm run preview # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev     # API server with hot reload
npm run ml      # ML server
npm run dev:all # Both servers together
```

### Database Management
```bash
cd backend
npm run seed    # Seed database with initial data
npm run reset   # Reset database
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Change ports in .env files
   - Check for running processes

2. **MongoDB Connection**
   - Verify MongoDB URI in .env
   - Check network connectivity

3. **ML Service Errors**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Check Python version compatibility

4. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration

### Logs and Debugging
- **API Server**: Console logs for all requests
- **ML Service**: FastAPI automatic logging
- **Frontend**: Browser dev tools for React debugging

## 📈 Performance

- **Frontend**: Optimized React with lazy loading
- **Backend**: Efficient MongoDB queries with indexing
- **ML Models**: Optimized scikit-learn pipelines
- **Real-time**: Socket.io with connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**AgriSmart** - Empowering farmers with technology 🌱
