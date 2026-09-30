import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Pool } from "pg";

const isLocal = process.env.DB_ENV === "local";
const localPool = isLocal ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  if (isLocal) {
    const { rows } = await localPool!.query(
      "SELECT * FROM orders WHERE order_number = $1",
      [params.orderNumber]
    );
    if (rows.length === 0) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", params.orderNumber)
    .single();

  if (error) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  const { status, require_admin } = await req.json();

  // Admin-only statuses
  if (require_admin) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isLocal) {
    const { rows } = await localPool!.query(
      "UPDATE orders SET status = $1, updated_at = now() WHERE order_number = $2 RETURNING *",
      [status, params.orderNumber]
    );
    return NextResponse.json(rows[0]);
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("order_number", params.orderNumber)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}