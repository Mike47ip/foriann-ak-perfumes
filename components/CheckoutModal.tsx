"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

export default function CheckoutModal({ isOpen, onClose }: Props) {
  const { cart, totalPrice } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [status, setStatus] = useState<Status>("idle");

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    setStatus("sending");

    const orderLines = cart
      .map((i) => `${i.emoji} ${i.name} × ${i.qty} — ₵${(i.price * i.qty).toFixed(2)}`)
      .join("\n");

    const payload = {
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      delivery_address: form.address,
      customer_notes: form.notes || "—",
      order_items: orderLines,
      order_total: `₵${totalPrice.toFixed(2)}`,
      item_count: cart.reduce((s, i) => s + i.qty, 0),
      _subject: `🧴 New Order from ${form.name} — ₵${totalPrice.toFixed(2)}`,
      _replyto: form.email,
    };

    try {
      const res = await fetch("https://formspree.io/f/mdeklwav", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    setStatus("idle");
    setForm({ name: "", email: "", phone: "", address: "", notes: "" });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0 bg-charcoal/50 z-[300] backdrop-blur-sm" />
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">

          <div className="flex items-center justify-between px-6 py-5 border-b border-stone">
            <div>
              <h2 className="font-playfair text-xl">Complete Your Order</h2>
              <p className="text-mist text-xs mt-0.5">We&apos;ll confirm via email &amp; reach out to arrange delivery.</p>
            </div>
            <button onClick={handleClose} className="bg-transparent border-none cursor-pointer text-charcoal text-xl leading-none">✕</button>
          </div>

          {status === "success" ? (
            <div className="px-6 py-16 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="font-playfair text-2xl mb-2">Order Received!</h3>
              <p className="text-mist text-sm mb-6 max-w-xs mx-auto">
                Thank you, {form.name}! We&apos;ve received your order and will be in touch at{" "}
                <span className="text-charcoal">{form.email}</span>.
              </p>
              <button onClick={handleClose} className="bg-charcoal text-ivory text-xs tracking-widest px-8 py-3 border-none cursor-pointer hover:bg-bronze transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 bg-[#faf7f3] border-b border-stone">
                <p className="text-xs tracking-widest text-mist mb-3">YOUR ORDER</p>
                <div className="flex flex-col gap-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.emoji} {item.name} <span className="text-mist">× {item.qty}</span></span>
                      <span className="font-playfair text-bronze">₵{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-stone">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-playfair text-lg">₵{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-xs tracking-widest text-mist">YOUR DETAILS</p>

                {[
                  { key: "name", label: "FULL NAME", type: "text", placeholder: "Ama Darkwah" },
                  { key: "email", label: "EMAIL", type: "email", placeholder: "ama@email.com" },
                  { key: "phone", label: "PHONE", type: "tel", placeholder: "+233 XX XXX XXXX" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs tracking-widest text-charcoal block mb-1.5">{label} *</label>
                    <input
                      required
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-stone px-4 py-2.5 text-sm outline-none focus:border-bronze transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs tracking-widest text-charcoal block mb-1.5">DELIVERY ADDRESS *</label>
                  <textarea required value={form.address} onChange={(e) => set("address", e.target.value)}
                    placeholder="Street, Area, City" rows={2}
                    className="w-full border border-stone px-4 py-2.5 text-sm outline-none focus:border-bronze transition-colors resize-none" />
                </div>

                <div>
                  <label className="text-xs tracking-widest text-charcoal block mb-1.5">
                    NOTES <span className="normal-case font-normal tracking-normal text-mist">(optional)</span>
                  </label>
                  <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
                    placeholder="Gift wrapping, preferred delivery time, etc." rows={2}
                    className="w-full border border-stone px-4 py-2.5 text-sm outline-none focus:border-bronze transition-colors resize-none" />
                </div>

                {status === "error" && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}

                <button type="submit" disabled={status === "sending"}
                  className="w-full bg-charcoal text-ivory text-xs tracking-widest py-4 border-none cursor-pointer hover:bg-bronze transition-colors disabled:opacity-50 mt-2">
                  {status === "sending" ? "PLACING ORDER..." : `PLACE ORDER — ₵${totalPrice.toFixed(2)}`}
                </button>

                <p className="text-mist text-xs text-center">Payment is arranged after we confirm your order.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}