"""
╔══════════════════════════════════════════════════════════╗
║  SAFEVOICE — backend/app.py                              ║
║  STEP 5: Start the backend                               ║
║  Command: uvicorn app:app --reload --port 8000           ║
║  Docs UI: http://localhost:8000/docs                     ║
╚══════════════════════════════════════════════════════════╝
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from predictor import predict

app = FastAPI(
    title       = "SafeVoice API",
    description = "Crime severity prediction and legal help for women in India",
    version     = "1.0.0"
)

# ── CORS ─────────────────────────────────────────────────
# After Vercel deploys, replace "https://your-app.vercel.app"
# with your actual Vercel URL e.g. "https://safevoice.vercel.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://safevoice-xi.vercel.app/",   # ← replace with your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request Schema ────────────────────────────────────────

class CrimeInput(BaseModel):
    description: str = Field(
        ..., min_length=20, max_length=2000,
        example="My husband beats me and threatens to kill me if I tell anyone."
    )
    name:     Optional[str] = Field(None, example="Anonymous")
    location: Optional[str] = Field(None, example="Chennai, Tamil Nadu")

# ── Routes ────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "SafeVoice API is running ✓", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict_crime(body: CrimeInput):
    """
    Main endpoint.
    Send a crime description → get severity, legal help, and a similar real case.
    """
    try:
        result = predict(body.description)
        return result
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Models not trained yet. Run: python ml/train_model.py"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/helplines")
def helplines():
    """Emergency helplines — always available."""
    return {
        "emergency": [
            {"name": "Police Emergency",          "number": "100"},
            {"name": "Women Helpline",             "number": "181"},
            {"name": "NCW Helpline",               "number": "7827-170-170"},
            {"name": "Cyber Crime Helpline",       "number": "1930"},
            {"name": "Anti-Trafficking Helpline",  "number": "1800-419-8588"},
            {"name": "Childline (under 18)",       "number": "1098"},
            {"name": "NALSA Free Legal Aid",       "number": "15100"},
            {"name": "One Stop Centre",            "number": "181"},
        ]
    }