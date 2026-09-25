const TAILWIND_PALETTE = [
  "bg-red-500 hover:bg-red-600", "bg-blue-500 hover:bg-blue-600", "bg-green-500 hover:bg-green-600",
  "bg-amber-500 hover:bg-amber-600", "bg-purple-500 hover:bg-purple-600", "bg-pink-500 hover:bg-pink-600",
  "bg-indigo-500 hover:bg-indigo-600", "bg-teal-500 hover:bg-teal-600", "bg-orange-500 hover:bg-orange-600"
];



export const getCarColor = (cellValue: string): string => {
    if (!cellValue || cellValue === ".") return "bg-gray-200";

    const index = cellValue.charCodeAt(0) % TAILWIND_PALETTE.length;
    return TAILWIND_PALETTE[index]
}



export const showSelectedCar = (cellValue: string, selectedCar: string): string => {
    if (!cellValue || cellValue === ".") return "";

    if (cellValue == selectedCar) return "border-4 border-white"

    return ""
}

