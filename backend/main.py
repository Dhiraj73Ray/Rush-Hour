from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import RushHourEngine

app = FastAPI(title="Rush Hour Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RushHourEngine()

class MoveRequest(BaseModel):
    car_id: str
    steps: int

@app.get("/api/state")
def get_state():
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