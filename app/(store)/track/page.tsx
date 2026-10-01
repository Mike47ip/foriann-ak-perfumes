"use client";

import { useState } from "react";

type OrderStatus = "processing" | "confirmed" | "dispatched" | "delivered" | "completed";

interface Order {
  order_number: string;
  customer_name: string;
  order_items: { name: string; qty: number; price: number; emoji: string }[];
  order_total: number;
  status: OrderStatus;
  created_at: string;
  delivery_address: string;
}

const STEPS: { key: OrderStatus; label: string; icon: string; desc: string }[] = [
  { key: "processing", label: "Processing", icon: "📦", desc: "Order received, awaiting payment confirmation" },
  { key: "confirmed", label: "Confirmed", icon: "✅", desc: "Payment confirmed by Westside Perfumes" },
  { key: "dispatched", label: "Dispatched", icon: "🚴", desc: "Your order is on its way with a rider" },
  { key: "delivered", label: "Delivered", icon: "📬", desc: "Order delivered — please confirm receipt" },
  { key: "completed", label: "Completed", icon: "✨", desc: "Order complete. Thank you!" },
];

const STATUS_ORDER: OrderStatus[] = ["processing", "confirmed", "dispatched", "delivered", "completed"];

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    const res = await fetch(`/api/orders/${orderNumber.trim().toUpperCase()}`);
    if (res.ok) {
      const data = await res.json();
      setOrder(data);
    } else {
      setError("Order not found. Please check your order number.");
    }
    setLoading(false);
  }

  async function handleConfirmDelivery() {
    if (!order) return;
    setConfirming(true);
    const res = await fetch(`/api/orders/${order.order_number}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed", require_admin: false }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder(updated);
    }
    setConfirming(false);
  }

  const currentStep = order ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-mist text-xs tracking-widest bg-transparent border-none cursor-pointer hover:text-charcoal mb-8 transition-colors"
        >
          ← BACK
        </button>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-10 h-px bg-bronze inline-block" />
            <span className="text-bronze text-xs tracking-[.2em]">ORDER TRACKING</span>
            <span className="w-10 h-px bg-bronze inline-block" />
          </div>
          <h1 className="font-playfair text-4xl text-charcoal mb-3">Track Your Order</h1>
          <p className="text-mist text-sm">Enter your order number to see the status of your delivery.</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-10">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. WSP-AB12CD34"
            className="flex-1 border border-stone px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors bg-white tracking-widest uppercase"
          />
          <button type="submit" disabled={loading}
            className="bg-charcoal text-ivory text-xs tracking-widest px-6 py-3 border-none cursor-pointer hover:bg-bronze transition-colors disabled:opacity-50">
            {loading ? "..." : "TRACK"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 px-6 py-4 text-red-600 text-sm text-center mb-6">
            {error}
          </div>
        )}

        {order && (
          <div className="bg-white p-8">
            {/* Order header */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-stone">
              <div>
                <p className="text-mist text-xs tracking-widest mb-1">ORDER NUMBER</p>
                <p className="font-playfair text-xl text-charcoal">{order.order_number}</p>
                <p className="text-mist text-xs mt-1">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="text-mist text-xs tracking-widest mb-1">TOTAL</p>
                <p className="font-playfair text-xl text-bronze">₵{Number(order.order_total).toFixed(2)}</p>
              </div>
            </div>

            {/* Status timeline */}
            <div className="mb-8">
              <p className="text-mist text-xs tracking-widest mb-6">STATUS</p>
              <div className="flex flex-col gap-0">
                {STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step.key} className="flex gap-4 items-start">
                      {/* Line + dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all ${done ? "bg-bronze" : "bg-stone"
                          }`}>
                          {done ? step.icon : <span className="w-2 h-2 rounded-full bg-mist inline-block" />}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 ${i < currentStep ? "bg-bronze" : "bg-stone"}`} />
                        )}
                      </div>
                      {/* Label */}
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${done ? "text-charcoal" : "text-mist"}`}>
                          {step.label}
                          {active && <span className="ml-2 text-bronze text-xs">← Current</span>}
                        </p>
                        <p className="text-mist text-xs mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order items */}
            <div className="border-t border-stone pt-6 mb-6">
              <p className="text-mist text-xs tracking-widest mb-4">YOUR ITEMS</p>
              <div className="flex flex-col gap-2">
                {(Array.isArray(order.order_items) ? order.order_items : []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.emoji} {item.name} <span className="text-mist">× {item.qty}</span></span>
                    <span className="font-playfair text-bronze">₵{Number(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm delivery button */}
            {order.status === "delivered" && (
              <button
                onClick={handleConfirmDelivery}
                disabled={confirming}
                className="w-full bg-bronze text-ivory text-xs tracking-widest py-4 border-none cursor-pointer hover:bg-[#d4aa88] transition-colors disabled:opacity-50"
              >
                {confirming ? "CONFIRMING..." : "✅ CONFIRM I RECEIVED MY ORDER"}
              </button>
            )}

            {order.status === "completed" && (
              <div className="text-center py-4 bg-[#f0f9f0] border border-green-200">
                <p className="text-green-700 text-sm">✨ Order completed! Thank you for shopping with us.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}