// utils/cn.ts (Modern class name merger: clsx + tailwind-merge for NativeWind/Tailwind in RN; lightweight, type-safe)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
