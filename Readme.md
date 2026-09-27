# 🚗 Rush Hour

Full-stack Rush Hour puzzle game. Slide the red car (A) out of the traffic jam.

- **Backend:** FastAPI + pure-Python engine
- **Frontend:** React 19 + TypeScript + Vite + Tailwind

---

## Run it

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
→ http://127.0.0.1:8000

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
→ http://localhost:5173

Optional — point at a different backend via `frontend/.env`:
```
VITE_API_URL=http://127.0.0.1:8000
```

---

## How to play

1. Click/tap a car to select it.
2. Move it:
   - **Drag** the car along its axis (works on touch + mouse)
   - **Arrow keys** on desktop
   - **DPad** on desktop/tablet
3. Get car **A** to the exit edge to win.

Cars only move along their own axis. Arrow shows the exit.

---

## Adding levels

Edit `backend/levels.py`:

```python
LEVELS = [
    {
        "name": "First Exit",
        "difficulty": "easy",
        "puzzle": ".A.... .A..C. .A..C. .BBB.. ...... ......",
        "exit_side": "bottom",      # right | left | top | bottom
        "exit_position": 1,          # row (for L/R exits) or column (for T/B exits)
    },
    # add more...
]
```

**Puzzle string rules:**
- One string of `size × size` chars (spaces optional as row separators)
- `.` = empty, letters = cars
- Same letter grouped contiguously = one car
- Every car must be ≥ 2 cells
- `A` must be 2+ cells, aligned with `exit_position`, and matching `exit_side` axis
  - `right`/`left` → A must be horizontal in row `exit_position`
  - `top`/`bottom` → A must be vertical in col `exit_position`
- `A` must not already be at the exit
- Puzzle must be solvable

Bad puzzles crash the backend on startup with a clear error. Restart uvicorn and check the terminal.

---

## API

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| GET | `/api/state` | — | current `GameState` |
| GET | `/api/levels` | — | `{ levels, total }` |
| POST | `/api/load` | `{ "level": 0 }` | `GameState` |
| POST | `/api/move` | `{ "car_id": "A", "steps": 1 }` | `GameState` |
| POST | `/api/reset` | — | `GameState` |

Move `status` values: `ok`, `blocked`, `wall`, `invalid`, `not_found`.

---

## Structure

```
backend/
  engine.py     # game logic
  levels.py     # puzzle list
  main.py       # FastAPI routes

frontend/src/
  components/   # Board, Controls, HUD, Layout, Navigation, overlays
  hooks/        # useGameState, useTimer
  api/          # gameApi.ts
  utils/        # carHelpers.ts
  types/        # game.ts
```

---

## Roadmap

- [ ] More puzzles (20–50 across easy/medium/hard)
- [ ] Backend tests
- [ ] Undo + move history
- [ ] Deploy

---

## License

Personal project.