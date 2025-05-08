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
 * Format a price in STRK for display with fixed decimal places
 * @param strkPrice Price in STRK
 * @returns Formatted price string with fixed decimal places (e.g., "0.500 STRK")
 */
export function formatStrkPrice(strkPrice: number | string): string {
  return `${Number(strkPrice).toFixed(PRICE_DECIMALS)} STRK`;
}

/**
 * Format a price in STRK for display without forcing decimal places
 * @param strkPrice Price in STRK
 * @returns Formatted price string showing only necessary decimal places (e.g., "3 STRK", "4.2 STRK", or "0.003 STRK")
 */
export function formatStrkPriceNatural(strkPrice: number | string): string {
  // Convert to string first to preserve original representation
  const strPrice = String(strkPrice);
  
  // Check if the price already includes "STRK"
  if (strPrice.includes('STRK')) {
    return strPrice; // Return as is if it already has STRK
  }
  
  // Parse as number to check if it's an integer
  const num = Number(strPrice);
  
  if (Number.isInteger(num)) {
    // If it's a whole number, don't show decimal places
    return `${num} STRK`;
  } else {
    // For decimal values, preserve the original string representation
    // This will maintain values like 0.003 without rounding or truncating
    return `${strPrice} STRK`;
  }
}
