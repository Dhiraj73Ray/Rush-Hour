import { type CarData } from "../types/game";

const TAILWIND_PALETTE = [
  "bg-red-500", "bg-blue-500", "bg-green-500", 
  "bg-amber-500", "bg-purple-500", "bg-pink-500", 
  "bg-indigo-500", "bg-teal-500", "bg-orange-500"
];

const CAR_PALETTE = [
  "bg-[#3d5a80]", // deep blue
  "bg-[#2a9d8f]", // teal
  "bg-[#e9c46a]", // golden
  "bg-[#f4a261]", // orange
  "bg-[#a06cd5]", // purple
  "bg-[#8ecae6]", // sky
  "bg-[#84a98c]", // sage
  "bg-[#ff8fab]", // pink
  "bg-[#c9ada7]", // taupe
];

export const getCarColor = (cellValue: string): string => {
  if (!cellValue || cellValue === ".") return "bg-gray-200";
  if (cellValue === "A") return "bg-[#e63946]"; // A is always the red car

  // B, C, D, ... → 0, 1, 2, ...
  const index = (cellValue.charCodeAt(0) - 66) % CAR_PALETTE.length;
  return CAR_PALETTE[index < 0 ? index + CAR_PALETTE.length : index];
};

export const showSelectedCar = (
  cellValue: string,
  selectedCar: string,
  ridx: number,
  cidx: number,
  cars?: Record<string, CarData>
): string => {
  if (!cellValue || cellValue === "." || cellValue !== selectedCar || !cars) {
    return "";
  }

  const car = cars[selectedCar];
  if (!car) return "border-4 border-white";

  const borderColor = "border-white";

  if (car.direction === "V") {
    const isTop = ridx === car.row;
    const isBottom = ridx === car.row + car.length - 1;

    if (isTop) {
      return `border-t-4 border-l-4 border-r-4 ${borderColor}`;
    }
    if (isBottom) {
      return `border-b-4 border-l-4 border-r-4 ${borderColor}`;
    }
    return `border-l-4 border-r-4 ${borderColor}`;
  }

  if (car.direction === "H") {
    const isLeft = cidx === car.col;
    const isRight = cidx === car.col + car.length - 1;

    if (isLeft) {
      return `border-l-4 border-t-4 border-b-4 ${borderColor}`;
    }
    if (isRight) {
      return `border-r-4 border-t-4 border-b-4 ${borderColor}`;
    }
    return `border-t-4 border-b-4 ${borderColor}`;
  }

  return "border-4 border-white";
};


/**
 * Returns the min/max offset the car can be dragged along its axis,
 * given the current (server) board state.
 */
export function getCarDragBounds(
  board: string[][],
  carId: string,
  cars: Record<string, CarData>
): { min: number; max: number } {
  const car = cars[carId];
  if (!car) return { min: 0, max: 0 };

  const size = board.length;
  const last = size - 1;
  const isH = car.direction === "H";
  let maxPos = 0;
  let maxNeg = 0;

  while (true) {
    const offset = maxPos + 1;
    const r = isH ? car.row : car.row + car.length - 1 + offset;
    const c = isH ? car.col + car.length - 1 + offset : car.col;
    if (r > last || c > last) break;
    if (board[r][c] !== ".") break;
    maxPos = offset;
  }

  while (true) {
    const offset = maxNeg - 1;
    const r = isH ? car.row : car.row + offset;
    const c = isH ? car.col + offset : car.col;
    if (r < 0 || c < 0) break;
    if (board[r][c] !== ".") break;
    maxNeg = offset;
  }

  return { min: maxNeg, max: maxPos };
}

/**
 * Returns a shallow-copied board where `previewCar` is shifted by
 * `previewOffset` cells along its axis. Original board is untouched.
 */
export function getPreviewBoard(
  board: string[][],
  cars: Record<string, CarData>,
  previewCar: string | null,
  previewOffset: number
): string[][] {
  if (!previewCar || previewOffset === 0 || !cars[previewCar]) return board;

  const car = cars[previewCar];
  const size = board.length;
  const next = board.map((row) => [...row]);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (next[r][c] === previewCar) next[r][c] = ".";
    }
  }

  for (let i = 0; i < car.length; i++) {
    if (car.direction === "H") {
      const c = car.col + previewOffset + i;
      if (c >= 0 && c < size) next[car.row][c] = previewCar;
    } else {
      const r = car.row + previewOffset + i;
      if (r >= 0 && r < size) next[r][car.col] = previewCar;
    }
  }

  return next;
}