import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Constants for price conversion
export const PRICE_DECIMALS = 3;
export const PRICE_MULTIPLIER = 10 ** PRICE_DECIMALS;

/**
 * Convert a price from STRK to milliunits (for storing in the contract)
 * @param strkPrice Price in STRK (e.g., 0.5)
 * @returns Price in milliunits as an integer (e.g., 500)
 */
export function strkToMilliunits(strkPrice: number | string): number {
  return Math.floor(Number(strkPrice) * PRICE_MULTIPLIER);
}

/**
 * Convert a price from milliunits to STRK (for displaying in the UI)
 * @param milliunits Price in milliunits (e.g., 500)
 * @returns Price in STRK (e.g., 0.5)
 */
export function milliunitsToStrk(milliunits: number | string): number {
  return Number(milliunits) / PRICE_MULTIPLIER;
}

/**
 * Format a price in STRK for display
 * @param strkPrice Price in STRK
 * @returns Formatted price string (e.g., "0.500 STRK")
 */
export function formatStrkPrice(strkPrice: number | string): string {
  return `${Number(strkPrice).toFixed(PRICE_DECIMALS)} STRK`;
}
