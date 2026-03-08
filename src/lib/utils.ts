import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes intelligently, handling conflicts
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 * @param inputs - Variable number of class values to combine
 * @returns Combined CSS class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
