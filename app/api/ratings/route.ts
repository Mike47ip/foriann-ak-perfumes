import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Pool } from "pg";

const isLocal = process.env.DB_ENV === "local";
const localPool = isLocal ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");
  if (!productId) return NextResponse.json({ error: "product_id required" }, { status: 400 });

  if (isLocal) {
    const { rows } = await localPool!.query(
      "SELECT ROUND(AVG(score)::numeric, 1) as average, COUNT(*) as count FROM ratings WHERE product_id = $1",
      [productId]
    );
    return NextResponse.json({ average: Number(rows[0].average) || 0, count: Number(rows[0].count) || 0 });
  }

  const { data } = await supabase
    .from("ratings")
    .select("score")
    .eq("product_id", productId);

  const count = data?.length || 0;
  const average = count > 0 ? data!.reduce((s, r) => s + r.score, 0) / count : 0;
  return NextResponse.json({ average: Math.round(average * 10) / 10, count });
}

export async function POST(req: NextRequest) {
  const { product_id, score } = await req.json();
  if (!product_id || !score || score < 1 || score > 5) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (isLocal) {
    await localPool!.query(
      "INSERT INTO ratings (product_id, score) VALUES ($1, $2)",
      [product_id, score]
    );
    const { rows } = await localPool!.query(
      "SELECT ROUND(AVG(score)::numeric, 1) as average, COUNT(*) as count FROM ratings WHERE product_id = $1",
      [product_id]
    );
    return NextResponse.json({ average: Number(rows[0].average), count: Number(rows[0].count) });
  }

  await supabase.from("ratings").insert({ product_id, score });
  const { data } = await supabase.from("ratings").select("score").eq("product_id", product_id);
  const count = data?.length || 0;
  const average = count > 0 ? data!.reduce((s, r) => s + r.score, 0) / count : 0;
  return NextResponse.json({ average: Math.round(average * 10) / 10, count });
}