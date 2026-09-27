The earlier code fires once per gesture because of the `triggered` flag.
replaced the whole swipe system with a proper **drag preview**: the car follows your finger visually, and only when you release does **one** move request get sent with the net delta.

Plus keyboard controls. Let's go.

## How the new drag works

1. **Press** on a car → it selects, drag is armed
2. **Drag** along the car's axis → preview offset updates in real-time, clamped to walls/other cars
3. **Release** → one `move(car, netOffset)` call to the server
4. **Tap without moving** → just selects (offset 0, no request)

So dragging 2 up → 3 down → 1 up ends at net 0, and no request is sent. Dragging right 3 sends `move(A, +3)` in one shot.


## How each interaction behaves now

| Interaction | Result |
|---|---|
| **Click car** (no drag) | Selects it, no move sent |
| **Drag car 1 cell, release** | One `move(car, ±1)` |
| **Drag car 3 cells, release** | One `move(car, ±3)` — backend moves as far as possible in one shot |
| **Drag 2 up, drag 3 down, drag 1 up (in one continuous gesture)** | Net offset = 0 → no request sent |
| **Drag car into a wall / other car** | Preview clamps at the wall; release sends clamped offset |
| **Arrow keys** | Move the selected car one cell (only valid axis) |
| **Hold arrow key** | Repeats as long as the browser fires repeat keydown events |
| **Arrow key with no car selected** | Ignored |

---

## Bug-proofing details

- **`setPointerCapture`** keeps all drag events on the origin cell, so dragging over other cars doesn't trigger their selection
- **`onLostPointerCapture`** cleans up if the browser drops the pointer (tab switch, etc.)
- **`useEffect([gameState?.board])`** clears the preview only when the server sends a fresh board — so the car doesn't flicker back to its old position while the request is in flight
- **`disabled={actionLoading}`** stops a second drag from starting mid-request
- **`touch-action: none`** on `.game-board` (already in CSS) keeps mobile scroll from stealing the gesture

---

## Test checklist

| Action | Expected |
|---|---|
| Tap car A on desktop | A selected, no move |
| Press on A, drag right 3 cells, release | A moves 3 right (or stops at obstacle), MOVES +1 |
| Drag A right, back left past start, release | Net = final offset (may be negative), one request |
| Drag A up/down | Ignored (H-axis) |
| Arrow keys with A selected | Left/Right work; Up/Down do nothing |
| Select C (V car) | Up/Down arrows work; Left/Right do nothing |
| Drag C into a car | Preview clamps, release sends clamped amount |
| Tap empty cell | Nothing |
| On mobile | Same behavior, no page scroll during drag |
| Drag while request in flight | Ignored (disabled) |
