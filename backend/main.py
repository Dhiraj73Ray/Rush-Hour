from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import RushHourEngine

app = FastAPI(title="Rush Hour Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RushHourEngine()

class MoveRequest(BaseModel):
    car_id: str
    steps: int

@app.get("/api/state")
def get_state():
    state = engine.get_state()
    state["message"] = "OK"
    return state

@app.post("/api/move")
def make_move(req: MoveRequest):
    status = engine.move(req.car_id, req.steps)
    state = engine.get_state()
    state["message"] = status
    return state

@app.post("/api/reset")
def reset_puzzle():
    engine.reset()
    state = engine.get_state()
    state["message"] = "Puzzle Reset"
    return state