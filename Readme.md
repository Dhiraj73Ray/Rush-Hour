## `README.md`

# 🚗 Rush Hour

**Live:** https://play-rush-hour.vercel.app

Full-stack Rush Hour puzzle game. Slide the red car (A) out of the traffic jam.

- **Backend:** FastAPI + pure-Python engine
- **Frontend:** React 19 + TypeScript + Vite + Tailwind + React Router

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
   - **Drag** the car along its axis (touch + mouse)
   - **Arrow keys** on desktop
   - **DPad** on desktop/tablet
3. Get car **A** to the exit edge to win.

Cars only move along their own axis. The arrow marker shows the exit.

---

## Features

- Drag-to-move with live preview (net delta sent in one request on release)
- Keyboard arrow controls
- Progress tracking (solved levels, best moves, best time) in `localStorage`
- Level picker modal (in-game) + Levels page (from menu)
- History page with per-level best stats
- Timer, move counter
- Congrats overlay with Next Level
- Connection-error overlay with auto-retry
- Responsive: desktop / tablet / mobile
- Light / dark mode

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
        "exit_position": 1,          # row (L/R exits) or column (T/B exits)
    },
    # add more...
]
```

**Puzzle string rules:**
- One string of `size × size` chars (spaces optional as row separators)
- `.` = empty, letters = cars
- Same letter grouped contiguously = one car
- Every car must be ≥ 2 cells
- `A` must be 2+ cells, aligned with `exit_position`, and match `exit_side` axis
  - `right`/`left` → A must be horizontal in row `exit_position`
  - `top`/`bottom` → A must be vertical in col `exit_position`
- `A` must not already be at the exit
- Puzzle must be solvable

Bad puzzles crash the backend on startup with a clear error. Restart uvicorn and check the terminal.

---

## License

Personal project.
