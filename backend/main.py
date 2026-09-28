from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import RushHourEngine
from levels import LEVELS
import os

app = FastAPI(title="Rush Hour Engine API")


ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Production frontend URL from Render env var
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    ALLOWED_ORIGINS.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RushHourEngine()

class MoveRequest(BaseModel):
    car_id: str
    steps: int

class LoadRequest(BaseModel):
    level: int

@app.get("/api/state")
def get_state():
    return engine.get_state()

@app.get("/api/levels")
def list_levels():
    return {
        "levels": [
            {"index": i, "name": l["name"], "difficulty": l["difficulty"]}
            for i, l in enumerate(LEVELS)
        ],
        "total": len(LEVELS),
    }

@app.post("/api/load")
def load_level(req: LoadRequest):
    try:
        engine.load_level(req.level)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return engine.get_state()

@app.post("/api/move")
def make_move(req: MoveRequest):
    result = engine.move(req.car_id, req.steps)
    state = engine.get_state()
    state["status"] = result["status"]
    state["message"] = result["message"]
    return state

@app.post("/api/reset")
def reset_puzzle():
    engine.reset()
    state = engine.get_state()
    state["status"] = "ok"
    state["message"] = "Puzzle Reset"
    return state