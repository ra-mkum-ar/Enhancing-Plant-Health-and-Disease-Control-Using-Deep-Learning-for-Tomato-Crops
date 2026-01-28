from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import base64
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ScanCreate(BaseModel):
    image_base64: str

class Scan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    image_base64: str
    disease_detected: Optional[str] = None
    confidence: Optional[str] = None
    severity: Optional[str] = None
    treatment: Optional[str] = None
    recommendations: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DiseaseInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    symptoms: List[str]
    causes: List[str]
    treatment: str
    prevention: List[str]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=user_data.email, name=user_data.name)
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['password_hash'] = hash_password(user_data.password)
    
    await db.users.insert_one(doc)
    token = create_token(user.id)
    
    return {
        "user": {"id": user.id, "email": user.email, "name": user.name},
        "token": token
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    user_doc = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_data.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user_doc['id'])
    
    return {
        "user": {"id": user_doc['id'], "email": user_doc['email'], "name": user_doc['name']},
        "token": token
    }

@api_router.get("/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    return user_doc

@api_router.post("/scans")
async def create_scan(scan_data: ScanCreate, user_id: str = Depends(get_current_user)):
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"scan_{uuid.uuid4()}",
            system_message="You are an expert agricultural AI assistant specializing in tomato plant disease detection. Analyze the provided image and identify any diseases, their severity, and provide treatment recommendations."
        ).with_model("gemini", "gemini-3-flash-preview")
        
        image_content = ImageContent(image_base64=scan_data.image_base64)
        
        user_message = UserMessage(
            text="""Analyze this tomato plant image and provide a detailed diagnosis in the following JSON format:
{
  "disease_detected": "Name of disease or 'Healthy'",
  "confidence": "High/Medium/Low",
  "severity": "None/Mild/Moderate/Severe",
  "symptoms_observed": ["symptom1", "symptom2"],
  "treatment": "Detailed treatment description",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Only return the JSON object, no additional text.""",
            file_contents=[image_content]
        )
        
        response = await chat.send_message(user_message)
        
        import json
        response_text = response.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        analysis = json.loads(response_text)
        
        scan = Scan(
            user_id=user_id,
            image_base64=scan_data.image_base64,
            disease_detected=analysis.get('disease_detected', 'Unknown'),
            confidence=analysis.get('confidence', 'Unknown'),
            severity=analysis.get('severity', 'Unknown'),
            treatment=analysis.get('treatment', 'No treatment information available'),
            recommendations=analysis.get('recommendations', [])
        )
        
        doc = scan.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.scans.insert_one(doc)
        
        return scan.model_dump()
    
    except Exception as e:
        logging.error(f"Scan error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

@api_router.get("/scans")
async def get_scans(user_id: str = Depends(get_current_user)):
    scans = await db.scans.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for scan in scans:
        if isinstance(scan['created_at'], str):
            scan['created_at'] = datetime.fromisoformat(scan['created_at'])
    return scans

@api_router.get("/scans/{scan_id}")
async def get_scan(scan_id: str, user_id: str = Depends(get_current_user)):
    scan = await db.scans.find_one({"id": scan_id, "user_id": user_id}, {"_id": 0})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if isinstance(scan['created_at'], str):
        scan['created_at'] = datetime.fromisoformat(scan['created_at'])
    return scan

@api_router.get("/diseases")
async def get_diseases():
    diseases = [
        {
            "id": "early-blight",
            "name": "Early Blight",
            "description": "A common fungal disease caused by Alternaria solani affecting tomato plants.",
            "symptoms": ["Dark brown spots with concentric rings on leaves", "Yellowing around spots", "Premature leaf drop"],
            "causes": ["Warm, humid conditions", "Poor air circulation", "Infected plant debris"],
            "treatment": "Remove infected leaves, apply fungicide (copper-based or chlorothalonil), improve air circulation.",
            "prevention": ["Crop rotation", "Mulching to prevent soil splash", "Proper spacing", "Remove plant debris"]
        },
        {
            "id": "late-blight",
            "name": "Late Blight",
            "description": "Devastating disease caused by Phytophthora infestans, can destroy entire crops.",
            "symptoms": ["Water-soaked spots on leaves", "White fungal growth on undersides", "Brown lesions on stems and fruit"],
            "causes": ["Cool, wet weather", "High humidity", "Infected transplants"],
            "treatment": "Remove infected plants immediately, apply fungicide (copper or mancozeb), ensure good drainage.",
            "prevention": ["Plant resistant varieties", "Avoid overhead watering", "Good air circulation", "Regular monitoring"]
        },
        {
            "id": "leaf-mold",
            "name": "Leaf Mold",
            "description": "Fungal disease caused by Passalora fulva, common in greenhouse tomatoes.",
            "symptoms": ["Yellow spots on upper leaf surfaces", "Olive-green to brown fuzzy growth underneath", "Leaf curling and death"],
            "causes": ["High humidity (above 85%)", "Poor ventilation", "Dense plant canopy"],
            "treatment": "Reduce humidity, improve ventilation, apply fungicide if severe, remove affected leaves.",
            "prevention": ["Adequate spacing", "Good ventilation", "Lower humidity", "Plant resistant varieties"]
        },
        {
            "id": "septoria-leaf-spot",
            "name": "Septoria Leaf Spot",
            "description": "Fungal disease caused by Septoria lycopersici affecting lower leaves.",
            "symptoms": ["Small circular spots with dark borders", "Gray centers", "Black specks in center"],
            "causes": ["Warm, wet conditions", "Splash from rain or irrigation", "Infected debris"],
            "treatment": "Remove infected leaves, apply fungicide, mulch around plants, avoid wetting foliage.",
            "prevention": ["Crop rotation", "Staking plants", "Watering at base", "Remove lower leaves"]
        },
        {
            "id": "bacterial-spot",
            "name": "Bacterial Spot",
            "description": "Bacterial disease affecting leaves, stems, and fruit.",
            "symptoms": ["Small dark brown spots", "Yellow halos around spots", "Leaf drop", "Fruit lesions"],
            "causes": ["Warm, wet weather", "Contaminated seeds", "Infected transplants"],
            "treatment": "Apply copper-based bactericide, remove infected plants, avoid overhead watering.",
            "prevention": ["Use disease-free seeds", "Crop rotation", "Avoid working with wet plants", "Good sanitation"]
        },
        {
            "id": "mosaic-virus",
            "name": "Tomato Mosaic Virus",
            "description": "Viral disease causing mottled leaves and reduced yield.",
            "symptoms": ["Mottled light and dark green leaves", "Stunted growth", "Distorted leaves", "Reduced fruit set"],
            "causes": ["Infected seeds or transplants", "Mechanical transmission", "Contaminated tools"],
            "treatment": "No cure - remove and destroy infected plants immediately to prevent spread.",
            "prevention": ["Use resistant varieties", "Sanitize tools", "Control aphids", "Buy certified disease-free plants"]
        }
    ]
    return diseases

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()