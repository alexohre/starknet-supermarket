import { shortString } from "starknet";
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "./contracts";
import { milliunitsToStrk, formatStrkPriceNatural } from "./utils";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: number;
}

/**
 * Process raw product data from the contract into our Product interface
 * @param data - Raw data from the contract
 * @returns Processed products array
 */
export function processProductData(data: any[]): Product[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  try {
    // Transform the contract data into our Product interface
    return data.map((item: any) => {
      // Extract values from the contract response
      const id = String(item.id);
      const name = shortString.decodeShortString(item.name);
      
      // First convert from milliunits to STRK, then format naturally
      const priceInStrk = milliunitsToStrk(Number(item.price));
      const price = formatStrkPriceNatural(priceInStrk);
      
      const stock = Number(item.stock);
      const description = item.description; // ByteArray is returned as string
      const category = shortString.decodeShortString(item.category);
      const image = item.image; // ByteArray is returned as string

      return {
        id,
        name,
        price,
        stock,
        description,
        category,
        image
      };
    });
  } catch (error) {
    console.error("Error processing product data:", error);
    return [];
  }
}
