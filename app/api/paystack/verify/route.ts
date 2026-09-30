import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { reference, order_data } = await req.json();

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await res.json();

  if (data.data?.status === "success") {
    // Save order to DB after successful payment
    if (order_data) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "https://www.westsideperfumes.com"}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...order_data,
          payment_reference: reference,
          status: "confirmed",
        }),
      });
    }

    return NextResponse.json({ success: true, data: data.data });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}