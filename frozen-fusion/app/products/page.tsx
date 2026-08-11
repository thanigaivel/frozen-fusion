import ProductsClient from "./ProductsClient";
import { ALL_PRODUCTS, type Product } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Frozen Fusion",
  description: "Explore a universe of 100+ premium dessert flavours — from rich kulfi to exotic fusion drinks.",
};

export const revalidate = 60; // Revalidate at most every 60 seconds (ISR)

export default async function ProductsPage() {
  let initialProducts: Product[] = ALL_PRODUCTS;

  try {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";
    
    // Fetch products on the server side
    const res = await fetch(`${adminUrl}/api/products`, { 
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        initialProducts = json.data.map((p: any) => ({
          ...p,
          id: p._id || p.id,
        }));
      }
    } else {
      console.error(`Admin API responded with status: ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to fetch dynamic products on server, using fallback data:", err);
  }

  return <ProductsClient initialProducts={initialProducts} />;
}
