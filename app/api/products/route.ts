import { NextResponse } from "next/server";
import { addProduct, getAllProducts } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, imageUrl, price, soldOut } = body;

  if (!title || !imageUrl) {
    return NextResponse.json(
      { error: "title and imageUrl are required" },
      { status: 400 }
    );
  }

  const newProduct = addProduct({
    title,
    description: description || "",
    imageUrl,
    price: price ?? 0,
    soldOut: !!soldOut
  });

  return NextResponse.json(newProduct, { status: 201 });
}
