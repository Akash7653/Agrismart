# 🚀 ML Service Production Deployment Guide

**Status:** Updated March 9, 2026  
**Version:** 2.0.0  
**Security Level:** Production-Ready with Input Validation

---

## 📋 Quick Deployment Checklist

- ✅ Models trained with real data (99.32% crop accuracy)
- ✅ Input validation implemented (confidence threshold, plant detection)
- ✅ Error handling for invalid images
- ✅ API documentation (Swagger/ReDoc)
- ✅ Frontend integration ready
- ⚠️ ML service needs public deployment for production

---

## 🌐 Current Deployment Status

### Frontend
- **URL:** https://agrismart-mu.vercel.app
- **Provider:** Render
- **Status:** ✅ Running

### Backend API
- **URL:** https://agrismart-7zyv.onrender.com
- **Provider:** Render
- **Status:** ✅ Running

### ML Service
- **Current:** Local (http://localhost:8001)
- **Needed:** Public deployment (Render/AWS/Azure)
- **Status:** ⚠️ **NOT YET DEPLOYED**

---

## 🔴 Critical Issue: ML Service Not In Production

The disease detection and crop prediction require the ML service to be accessible from the internet.

### Problem:
```
Frontend (Vercel) → Cannot reach → ML Service (localhost:8001)
                                  ❌ BLOCKED
```

### Solution:
```
Frontend (Vercel) → Can reach → ML Service (Public URL)
                               ✅ WORKING
```

---

## 🎯 Deployment Options

### Option 1: Deploy on Render (Recommended)

1. **Create a new Render service:**
   - Go to https://dashboard.render.com
   - Click "Create +" → "Web Service"
   - Connect GitHub repository: `Akash7653/Agrismart`
   - Configuration:
     ```
     Build Command: pip install -r backend/ml/requirements.txt
     Start Command: cd backend/ml && python main.py
     Environment: Python 3.11
     Instance: Standard (4GB RAM minimum for ML)
     ```

2. **Set environment variables:**
   ```
   PORT=8000
   PYTHONUNBUFFERED=true
   ```

3. **Update frontend config:**
   ```env
   # frontend/.env.production
   VITE_ML_URL=https://agrismart-ml.onrender.com
   ```

4. **Deploy:**
   - Render will auto-deploy when pushing to main branch
   - ML service will be available at: `https://agrismart-ml.onrender.com`

---

### Option 2: Deploy on AWS EC2

1. **Launch EC2 Instance:**
   ```bash
   # Ubuntu 22.04 LTS
   Instance Type: t3.medium (2GB RAM, 1 CPU minimum)
   Storage: 20GB
   Security Groups: Allow port 8000
   ```

2. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3.11 python3-pip git
   git clone https://github.com/Akash7653/Agrismart
   cd Agrismart/backend/ml
   pip install -r requirements.txt
   ```

3. **Start service:**
   ```bash
   python main.py
   # Or use supervisor for auto-restart
   ```

4. **Enable CORS for domain:**
   Update `main.py` to allow your frontend domain

---

### Option 3: Deploy on Azure Container Instances

1. **Build Docker image:**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY backend/ml/requirements.txt .
   RUN pip install -r requirements.txt
   COPY backend/ml/ .
   CMD ["python", "main.py"]
   ```

2. **Push to Azure Container Registry:**
   ```bash
   az acr build --registry agrismart --image ml-service:latest .
   ```

3. **Deploy Container Instance:**
   ```bash
   az container create --resource-group agrismart \
     --name ml-service --image agrismart.azurecr.io/ml-service:latest \
     --ports 8000 --cpu 2 --memory 4
   ```

---

## 📝 Environment Setup

### Local Development
```bash
# .env (development)
VITE_ML_URL=http://localhost:8001
ML_HOST=0.0.0.0
ML_PORT=8001
```

### Production
```bash
# .env (production)
VITE_ML_URL=https://agrismart-ml.onrender.com
ML_HOST=0.0.0.0
ML_PORT=8000
PYTHONUNBUFFERED=true
```

---

## 🔐 Security Considerations

### 1. CORS Configuration
```python
# In main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agrismart-mu.vercel.app",  # Frontend URL
        "http://localhost:5173",              # Local dev
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Rate Limiting
```python
# Add to main.py for production
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@limiter.limit("30/minute")
@app.post("/detect-disease")
async def detect_disease(...):
    ...
```

### 3. Authentication
```python
# Optional: Add API key requirement
@app.post("/detect-disease")
async def detect_disease(file: UploadFile, api_key: str = Header(None)):
    if api_key != os.getenv("ML_API_KEY"):
        raise HTTPException(status_code=403, detail="Invalid API key")
    ...
```

---

## 📊 Performance Optimization

### Model Loading
- Models load on startup (~2 seconds)
- Predictions cached in memory
- Inference time: <100ms per request

### Resource Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 2GB | 4GB |
| CPU | 1 core | 2 cores |
| Storage | 200MB | 500MB |
| Bandwidth | 1Mbps | 10Mbps |

---

## 🧪 Testing Deployment

### 1. Test from computer:
```bash
curl -X POST http://your-ml-url/health \
  -H "Content-Type: application/json"

# Expected response:
# {"status": "healthy", "models": "loaded"}
```

### 2. Test disease detection:
```bash
curl -X POST https://agrismart-ml.onrender.com/detect-disease \
  -F "file=@test_leaf.jpg"

# Expected response:
# {"disease": "...", "confidence": 0.95, ...}
```

### 3. Test from frontend:
- Go to https://agrismart-mu.vercel.app
- Upload a crop leaf image
- Should see detection results

---

## 🔄 Monitoring & Maintenance

### Health Checks
```bash
GET /health
GET /
```

### Logs
```bash
# On Render
# Logs visible in Render Dashboard → Logs tab

# On AWS
tail -f /var/log/ml-service.log

# On local
# Check Python console output
```

### Model Updates
```bash
# Retrain models
python train_crop_model.py
python train_disease_quick.py

# Restart service (auto on Render if git pushed)
```

---

## 🆘 Troubleshooting

### Error: "Cannot connect to ML service"
```
Solution: Check if ML service is deployed and accessible
- Verify URL is correct in frontend .env
- Check service health: curl ${ML_URL}/health
- Verify CORS configuration
```

### Error: "Model not found"
```
Solution: Models need to exist in production
- Commit model files to git-lfs OR
- Train models on production server OR
- Upload model artifacts to cloud storage
```

### Error: "Port 8000 already in use"
```
Solution: Use different port
python -c "import uvicorn; uvicorn.run('main:app', port=8001)"
```

---

## 📈 Next Steps

1. **Deploy ML Service:**
   - Choose deployment platform (Render recommended)
   - Configure environment variables
   - Deploy and test

2. **Update Frontend:**
   - Update `VITE_ML_URL` environment variable
   - Redeploy frontend on Render

3. **Enable Production Features:**
   - Add rate limiting
   - Enable CORS for production URL
   - Add authentication if needed

4. **Monitor & Maintain:**
   - Set up error logging
   - Monitor API performance
   - Retrain models periodically

---

## ✅ Production Checklist

- [ ] ML service deployed to public URL
- [ ] CORS configured for frontend domain  
- [ ] Environment variables set correctly
- [ ] Model files present and loadable
- [ ] Disease detection working end-to-end
- [ ] Crop prediction working end-to-end
- [ ] Error handling tested
- [ ] Performance acceptable (<2s response)
- [ ] Monitoring setup complete
- [ ] Backup/disaster recovery plan

---

**Status: Ready for Production Deployment**  
**Next Action: Deploy to Render or your chosen platform**
