import { type CarData } from "../types/game";

const TAILWIND_PALETTE = [
  "bg-red-500", "bg-blue-500", "bg-green-500", 
  "bg-amber-500", "bg-purple-500", "bg-pink-500", 
  "bg-indigo-500", "bg-teal-500", "bg-orange-500"
];

export const getCarColor = (cellValue: string): string => {
  if (!cellValue || cellValue === ".") return "bg-gray-200";
  
  const index = cellValue.charCodeAt(0) % TAILWIND_PALETTE.length;
  return TAILWIND_PALETTE[index];
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