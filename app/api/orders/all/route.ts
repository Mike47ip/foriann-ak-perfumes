import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Pool } from "pg";

const isLocal = process.env.DB_ENV === "local";

function getPool() {
  return new Pool({ connectionString: process.env.DATABASE_URL });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (isLocal) {
    const pool = getPool();
    const { rows } = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    return NextResponse.json(rows);
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}