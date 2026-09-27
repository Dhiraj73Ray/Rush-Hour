# RUSH HOUR ENGINE V2.0: TECHNICAL REPORT (PART 3)

**Scope:** Interactive Control Architecture & Visual State Synchronization

**Stack:** FastAPI + Vite + React + TypeScript + Tailwind CSS

---

### 1. Milestone Overview

Following the stabilization of the backend API bridge and the coordinate-based edge-detection border algorithm, this cycle focused on replacing primitive text-input mechanics (`car_id`, `steps`) with a responsive, context-aware 4-way D-Pad interface.

The deliverable bridges physical puzzle rules directly into graphical UI constraints, eliminating manual input parsing and enforcing game physics through interactive element states.

---

### 2. D-Pad Architecture & Component Integration

#### 2.1 Interface & Property Contracts

A dedicated component was created to isolate control-pad rendering from core board logic:

* Component file: `frontend-fullstack/src/components/DPad.tsx`

* State bindings: Bound to `useGameState` via parent props passed from `App.tsx`


```typescript
interface DPadProps {
  onUp?: (car: string) => void;
  onDown?: (car: string) => void;
  onLeft?: (car: string) => void;
  onRight?: (car: string) => void;
  className?: string;
  selectedCar: string;
  loading: boolean;
  gameState: GameState | null;
}

```

#### 2.2 Directional Mapping Matrix

The tactile directional pad maps discrete directional clicks into integer unit steps executed against the FastAPI backend `/api/move` endpoint:

* **UP:** `steps = -1` (decrement row index)
* **DOWN:** `steps = 1` (increment row index)
* **LEFT:** `steps = -1` (decrement column index)
* **RIGHT:** `steps = 1` (increment column index)

---

### 3. Context-Aware Control Lockouts & Boundary Checking

#### 3.1 Orientation Lockout

* Vehicles locked to a single axis must not expose perpendicular movement options.


* When `selectedCar` has `direction === "H"`, the UP and DOWN buttons are disabled via `disabled={... || direction === "H"}`.
* When `selectedCar` has `direction === "V"`, the LEFT and RIGHT buttons are disabled via `disabled={... || direction === "V"}`.
* When `!selectedCar` or during active network dispatch (`loading === true`), all directional buttons receive `opacity-40` and disable pointer events.

#### 3.2 Proactive Outer Wall Detection

To prevent needless HTTP rounds when a car is already positioned against the grid boundary, edge boundaries are calculated prior to click dispatch:

* **Top Wall Collision:** `car ? car.row === 0 : false`
* **Left Wall Collision:** `car ? car.col === 0 : false`
* **Right Wall Collision:** `car ? (car.col + car.length - 1 === 5) : false`
* **Bottom Wall Collision:** `car ? (car.row + car.length - 1 === 5) : false`

---

### 4. Debugging & Error Logs

#### 4.1 Strict Boolean Typing in JSX Attributes

* **Issue:** React threw compilation warnings:
```text
Type 'boolean | null' is not assignable to type 'boolean | undefined'.

```


* **Root Cause:** Expressions like `(car && car.col === 0)` evaluate to `null` when `car` is null, violating strict HTML button attribute typings.
* **Resolution:** Replaced short-circuiting with strict ternary evaluation:
```tsx
disabled={isControlDisabled || direction === "V" || (car ? car.col === 0 : false)}

```



#### 4.2 Error State Bleed ("Ghost Shaking")

* **Issue:** After triggering a blocked collision with Car B, selecting Car A or Car C caused the newly selected car to immediately flash red and vibrate despite not moving.
* **Root Cause:** `gameState.message` retained the string `"Blocked by another car!"` across selection changes, causing the cell conditional class:
```tsx
const isColliding = gameState?.message === "Blocked by another car!" && cell === selectedCar;

```


to evaluate to `true` for any active car.
* **Resolution:** Flushed the lingering collision message during the selection transition inside `useGameState.ts`:
```typescript
const handleCellClick = (car: string) => {
  if (car !== "." && car !== selectedCar) {
    setSelectedCar(car);
    setGameState(prev => prev ? { ...prev, message: "" } : null);
  }
};

```



---

### 5. Collision Feedback System

#### 5.1 CSS Keyframes (`App.css`)

```css
@keyframes shake {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-4px) translateY(-4px); }
  75% { transform: translateX(4px) translateY(4px); }
}

.animate-collide {
  animation: shake 0.3s ease-in-out;
  background-color: #ef4444 !important;
  filter: brightness(1.5);
}

```

#### 5.2 Dynamic Grid Feedback

The collision state integrates directly with the cell rendering pipeline in `App.tsx`, applying `.animate-collide` across all segments of the active car when an invalid path collision is confirmed by the backend response.

---

### 6. Current Implementation Matrix

| Module | Status | Role |
| --- | --- | --- |
| `backend/engine.py` | Complete | Pure CCD puzzle physics & boundary validation |
| `backend/main.py` | Complete | FastAPI REST routes (`/api/state`, `/api/move`, `/api/reset`) |
| `src/types/game.ts` | Complete | TypeScript interfaces for board, car orientation, and requests |
| `src/api/gameApi.ts` | Complete | HTTP abstractions using native `fetch` |
| `src/hooks/useGameState.ts` | Complete | Centralized controller hook with message flushing & network sync |
| `src/utils/carHelpers.ts` | Complete | Color palettes & mathematical edge-detection border algorithm |
| `src/components/DPad.tsx` | Complete | Context-aware 4-way arrow controls with boundary lockouts

 |
| `src/App.tsx` | Complete | 6x6 grid rendering, loading skeletons, and animation classes |

---

### 7. Next Stage: Victory State & Standalone Port

1. Implement a celebratory win overlay when `gameState.is_won === true`.
2. Port the engine logic into pure TypeScript to complete the standalone client version.