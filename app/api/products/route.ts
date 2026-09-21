import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getProducts, createProduct } from "@/lib/db";

export async function GET() {
  const data = await getProducts();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const product = await createProduct({
    id: Date.now(),
    name: body.name,
    family: body.family,
    price: Number(body.price),
    badge: body.badge || null,
    notes: body.notes || [],
    emoji: body.emoji || "🌸",
    image: body.image || null,
    gender: body.gender || "unisex",
  });

  return NextResponse.json(product, { status: 201 });
}