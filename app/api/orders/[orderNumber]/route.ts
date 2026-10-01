import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Pool } from "pg";

const isLocal = process.env.DB_ENV === "local";

function getPool() {
  return new Pool({ connectionString: process.env.DATABASE_URL });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  console.log("=== GET ORDER ===");
  console.log("DB_ENV:", process.env.DB_ENV);
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("orderNumber:", params.orderNumber);
  console.log("isLocal:", isLocal);

  if (isLocal) {
    try {
      const pool = getPool();
      console.log("Pool created successfully");
      const { rows } = await pool.query(
        "SELECT * FROM orders WHERE order_number = $1",
        [params.orderNumber]
      );
      console.log("Query result rows:", rows.length);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } catch (err) {
      console.error("DB Error:", err);
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", params.orderNumber)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Supabase fetch error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  console.log("=== PATCH ORDER ===");
  console.log("orderNumber:", params.orderNumber);

  const { status, require_admin } = await req.json();
  console.log("New status:", status);
  console.log("require_admin:", require_admin);

  if (require_admin) {
    const session = await getAdminSession();
    if (!session) {
      console.log("Unauthorized — no admin session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (isLocal) {
    try {
      const pool = getPool();
      const { rows } = await pool.query(
        "UPDATE orders SET status = $1, updated_at = now() WHERE order_number = $2 RETURNING *",
        [status, params.orderNumber]
      );
      console.log("Updated rows:", rows.length);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } catch (err) {
      console.error("DB Error:", err);
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("order_number", params.orderNumber)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Supabase patch error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}