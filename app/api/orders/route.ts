import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Pool } from "pg";

const isLocal = process.env.DB_ENV === "local";
const localPool = isLocal ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;

function generateOrderNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "WSP-";
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderNumber = generateOrderNumber();

  const order = {
    order_number: orderNumber,
    customer_name: body.customer_name,
    customer_email: body.customer_email,
    customer_phone: body.customer_phone,
    delivery_address: body.delivery_address,
    customer_notes: body.customer_notes || null,
    order_items: body.order_items,
    order_total: body.order_total,
    payment_reference: body.payment_reference || null,
    status: body.status || "processing",
  };

  if (isLocal) {
    const { rows } = await localPool!.query(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, delivery_address, customer_notes, order_items, order_total, payment_reference, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [order.order_number, order.customer_name, order.customer_email, order.customer_phone,
       order.delivery_address, order.customer_notes, JSON.stringify(order.order_items),
       order.order_total, order.payment_reference, order.status]
    );
    return NextResponse.json(rows[0], { status: 201 });
  }

  const { data, error } = await supabase.from("orders").insert(order).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}