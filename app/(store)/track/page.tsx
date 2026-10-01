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

const STATUS_ICONS: Record<OrderStatus, string> = {
  processing: "📦",
  confirmed:  "✅",
  dispatched: "🚴",
  delivered:  "📬",
  completed:  "✨",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  processing: "confirmed",
  confirmed:  "dispatched",
  dispatched: "delivered",
};

const TABS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all",        label: "All" },
  { key: "processing", label: "Processing" },
  { key: "confirmed",  label: "Confirmed" },
  { key: "dispatched", label: "Dispatched" },
  { key: "delivered",  label: "Delivered" },
  { key: "completed",  label: "Completed" },
];

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/orders/all");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Reset page when tab changes
  useEffect(() => { setPage(1); }, [activeTab]);

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

  const filtered = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const countByStatus = (status: OrderStatus) => orders.filter((o) => o.status === status).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-[#1c1b19]">Orders</h1>
          <p className="text-[#9e9890] text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={load}
          className="text-xs tracking-widest text-[#9e9890] bg-transparent border border-[#e8e2d9] px-4 py-2 cursor-pointer hover:border-[#1c1b19] hover:text-[#1c1b19] transition-colors">
          ↻ REFRESH
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-[#e8e2d9]">
        {TABS.map(({ key, label }) => {
          const count = key === "all" ? orders.length : countByStatus(key as OrderStatus);
          return (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 text-xs tracking-widest border-b-2 transition-all cursor-pointer bg-transparent ${
                activeTab === key
                  ? "border-[#b8916a] text-[#1c1b19]"
                  : "border-transparent text-[#9e9890] hover:text-[#1c1b19]"
              }`}>
              {label}
              {count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${
                  activeTab === key ? "bg-[#b8916a] text-white" : "bg-[#e8e2d9] text-[#9e9890]"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-[#9e9890] text-sm">Loading...</p>
      ) : paginated.length === 0 ? (
        <div className="bg-white p-16 text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="font-playfair text-xl text-[#1c1b19] mb-2">No orders here</p>
          <p className="text-[#9e9890] text-sm">
            {activeTab === "all" ? "Orders will appear here once customers checkout." : `No ${activeTab} orders.`}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginated.map((order) => (
              <div key={order.id} className="bg-white">
                {/* Order row */}
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer hover:bg-[#faf7f3] transition-colors"
                  onClick={() => setExpanded(expanded === order.order_number ? null : order.order_number)}
                >
                  <div className="text-2xl">{STATUS_ICONS[order.status]}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-playfair text-sm font-medium">{order.order_number}</p>
                      <span className={`text-[10px] px-2 py-0.5 capitalize ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[#9e9890] text-xs mt-0.5 truncate">
                      {order.customer_name} · {order.customer_phone}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-playfair text-[#b8916a] text-sm">₵{Number(order.order_total).toFixed(2)}</p>
                    <p className="text-[#9e9890] text-[10px] mt-0.5">
{new Date(order.created_at).toLocaleString("en-GH", {
  day: "numeric", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit"
})}
                    </p>
                  </div>

                  <span className="text-[#9e9890] text-xs ml-2">
                    {expanded === order.order_number ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded details */}
                {expanded === order.order_number && (
                  <div className="px-5 pb-5 border-t border-[#e8e2d9]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                      <div>
                        <p className="text-[#9e9890] text-[10px] tracking-widest mb-1">CUSTOMER</p>
                        <p className="text-sm">{order.customer_name}</p>
                        <p className="text-[#9e9890] text-xs">{order.customer_email}</p>
                        <p className="text-[#9e9890] text-xs">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-[#9e9890] text-[10px] tracking-widest mb-1">DELIVERY ADDRESS</p>
                        <p className="text-sm">{order.delivery_address}</p>
                      </div>
                      <div>
                        <p className="text-[#9e9890] text-[10px] tracking-widest mb-1">PAYMENT REF</p>
                        <p className="text-xs font-mono">{order.payment_reference || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[#9e9890] text-[10px] tracking-widest mb-1">ORDER DATE</p>
                        <p className="text-sm">{new Date(order.created_at).toLocaleString("en-GH")}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-[#e8e2d9] pt-4 mb-4">
                      <p className="text-[#9e9890] text-[10px] tracking-widest mb-3">ORDER ITEMS</p>
                      {(Array.isArray(order.order_items) ? order.order_items : []).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm mb-1.5">
                          <span>{item.emoji} {item.name} <span className="text-[#9e9890]">× {item.qty}</span></span>
                          <span className="font-playfair text-[#b8916a]">₵{Number(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between mt-3 pt-3 border-t border-[#e8e2d9]">
                        <span className="text-sm font-medium">Total</span>
                        <span className="font-playfair text-[#b8916a]">₵{Number(order.order_total).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action */}
                    {NEXT_STATUS[order.status] && (
                      <button
                        onClick={() => handleStatusUpdate(order.order_number, NEXT_STATUS[order.status]!)}
                        disabled={updating === order.order_number}
                        className="bg-[#1c1b19] text-[#f7f2ea] text-xs tracking-widest px-6 py-2.5 border-none cursor-pointer hover:bg-[#b8916a] transition-colors disabled:opacity-50"
                      >
                        {updating === order.order_number
                          ? "UPDATING..."
                          : `MARK AS ${NEXT_STATUS[order.status]?.toUpperCase()}`}
                      </button>
                    )}

                    {order.status === "completed" && (
                      <span className="text-green-600 text-xs">✨ Order completed</span>
                    )}

                    {order.status === "delivered" && (
                      <span className="text-orange-600 text-xs">📬 Awaiting customer confirmation</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-[#9e9890] text-xs">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 text-xs bg-transparent border border-[#e8e2d9] cursor-pointer hover:border-[#1c1b19] disabled:opacity-30 transition-colors"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs border cursor-pointer transition-colors ${
                      p === page
                        ? "bg-[#1c1b19] border-[#1c1b19] text-white"
                        : "bg-transparent border-[#e8e2d9] hover:border-[#1c1b19]"
                    }`}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 text-xs bg-transparent border border-[#e8e2d9] cursor-pointer hover:border-[#1c1b19] disabled:opacity-30 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}