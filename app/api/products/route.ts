import { api } from "@/app/polar/polar";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { result } = await api.products.list({
      isArchived: false,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
} 