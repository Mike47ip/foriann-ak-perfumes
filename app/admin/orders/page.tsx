"use client";

import { useEffect, useState } from "react";

type OrderStatus = "processing" | "confirmed" | "dispatched" | "delivered" | "completed";

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  order_items: { name: string; qty: number; price: number; emoji: string }[];
  order_total: number;
  status: OrderStatus;
  payment_reference: string;
  created_at: string;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  processing: "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  dispatched: "bg-purple-100 text-purple-700",
  delivered:  "bg-orange-100 text-orange-700",
  completed:  "bg-green-100 text-green-700",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  processing: "confirmed",
  confirmed:  "dispatched",
  dispatched: "delivered",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/orders/all");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleStatusUpdate(orderNumber: string, newStatus: OrderStatus) {
    setUpdating(orderNumber);
    await fetch(`/api/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, require_admin: true }),
    });
    await load();
    setUpdating(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-[#1c1b19]">Orders</h1>
          <p className="text-[#9e9890] text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {loading ? (
        <p className="text-[#9e9890] text-sm">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white p-16 text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="font-playfair text-xl text-[#1c1b19] mb-2">No orders yet</p>
          <p className="text-[#9e9890] text-sm">Orders will appear here once customers checkout.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-playfair text-lg font-medium">{order.order_number}</p>
                  <p className="text-[#9e9890] text-xs mt-0.5">
                    {order.customer_name} · {order.customer_phone}
                  </p>
                  <p className="text-[#9e9890] text-xs">{order.delivery_address}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="font-playfair text-[#b8916a] mt-2">₵{Number(order.order_total).toFixed(2)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-[#e8e2d9] pt-4 mb-4">
                {(Array.isArray(order.order_items) ? order.order_items : []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-[#1c1b19] mb-1">
                    <span>{item.emoji} {item.name} × {item.qty}</span>
                    <span>₵{Number(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {NEXT_STATUS[order.status] && (
                <button
                  onClick={() => handleStatusUpdate(order.order_number, NEXT_STATUS[order.status]!)}
                  disabled={updating === order.order_number}
                  className="bg-[#1c1b19] text-[#f7f2ea] text-xs tracking-widest px-6 py-2.5 border-none cursor-pointer hover:bg-[#b8916a] transition-colors disabled:opacity-50"
                >
                  {updating === order.order_number ? "..." : `MARK AS ${NEXT_STATUS[order.status]?.toUpperCase()}`}
                </button>
              )}

              {order.status === "completed" && (
                <span className="text-green-600 text-xs">✨ Completed</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}