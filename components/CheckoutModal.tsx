"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

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
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [orderNum, setOrderNum] = useState("");

  useEffect(() => {
    if (document.getElementById("paystack-script")) {
      setPaystackLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);
  }, []);

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function sendToFormspree(reference: string, orderNumber: string) {
    const orderLines = cart
      .map((i) => `${i.emoji} ${i.name} × ${i.qty} — ₵${(Number(i.price) * i.qty).toFixed(2)}`)
      .join("\n");

    await fetch("https://formspree.io/f/mdeklwav", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        delivery_address: form.address,
        customer_notes: form.notes || "—",
        order_number: orderNumber,
        order_items: orderLines,
        order_total: `₵${Number(totalPrice).toFixed(2)}`,
        payment_reference: reference,
        payment_status: "PAID via Paystack",
        _subject: `✅ PAID Order ${orderNumber} from ${form.name} — ₵${Number(totalPrice).toFixed(2)}`,
        _replyto: form.email,
      }),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0 || !paystackLoaded) return;
    if (!form.name || !form.email || !form.phone || !form.address) return;

    setStatus("sending");

    const amountInPesewas = Math.round(Number(totalPrice) * 100);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: amountInPesewas,
      currency: "GHS",
      ref: `WSP-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: form.name },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
          { display_name: "Address", variable_name: "address", value: form.address },
        ],
      },
      callback: async (response: { reference: string }) => {
        const orderItems = cart.map((i) => ({
          name: i.name,
          qty: i.qty,
          price: Number(i.price),
          emoji: i.emoji,
        }));

        const orderData = {
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          delivery_address: form.address,
          customer_notes: form.notes,
          order_items: orderItems,
          order_total: Number(totalPrice),
        };

        const verify = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference, order_data: orderData }),
        });

        const result = await verify.json();

        if (result.success) {
          const orderNumber = result.order?.order_number || response.reference;
          await sendToFormspree(response.reference, orderNumber);
          setOrderNum(orderNumber);
          setStatus("success");
        } else {
          setStatus("error");
        }
      },
      onClose: () => {
        setStatus("idle");
      },
    });

    handler.openIframe();
  }

  function handleClose() {
    setStatus("idle");
    setOrderNum("");
    setForm({ name: "", email: "", phone: "", address: "", notes: "" });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0 bg-charcoal/50 z-[300] backdrop-blur-sm" />
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone">
            <div>
              <h2 className="font-playfair text-xl">Complete Your Order</h2>
              <p className="text-mist text-xs mt-0.5">Fill in your details to proceed to payment.</p>
            </div>
            <button onClick={handleClose} className="bg-transparent border-none cursor-pointer text-charcoal text-xl leading-none">✕</button>
          </div>

          {status === "success" ? (
            <div className="px-6 py-12 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="font-playfair text-2xl mb-2">Payment Successful!</h3>
              <p className="text-mist text-sm mb-6 max-w-xs mx-auto">
                Thank you, {form.name}! Your payment was received and your order is confirmed. We'll be in touch at{" "}
                <span className="text-charcoal">{form.email}</span>.
              </p>

              {orderNum && (
                <div className="bg-[#faf7f3] border border-stone px-4 py-4 mb-6 text-left">
                  <p className="text-mist text-xs tracking-widest mb-1">YOUR ORDER NUMBER</p>
                  <p className="font-playfair text-2xl text-charcoal">{orderNum}</p>
                  <p className="text-mist text-xs mt-1">Save this to track your order</p>
                </div>
              )}

              <a href="/track"
                className="block text-center text-bronze text-xs tracking-widest hover:underline mb-6 no-underline">
                TRACK YOUR ORDER →
              </a>

              <button onClick={handleClose}
                className="bg-charcoal text-ivory text-xs tracking-widest px-8 py-3 border-none cursor-pointer hover:bg-bronze transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Order summary */}
              <div className="px-6 py-4 bg-[#faf7f3] border-b border-stone">
                <p className="text-xs tracking-widest text-mist mb-3">YOUR ORDER</p>
                <div className="flex flex-col gap-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.emoji} {item.name}{" "}
                        <span className="text-mist">× {item.qty}</span>
                      </span>
                      <span className="font-playfair text-bronze">
                        ₵{(Number(item.price) * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-stone">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-playfair text-lg">₵{Number(totalPrice).toFixed(2)}</span>
                </div>
              </div>

              {/* Customer fields */}
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-xs tracking-widest text-mist">YOUR DETAILS</p>

                <div>
                  <label className="text-xs tracking-widest text-charcoal block mb-1.5">FULL NAME *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="Ama Darkwah"
                    className="w-full border border-stone px-4 py-2.5 text-sm outline-none focus:border-bronze transition-colors" />
                </div>

                <div>
                  <label className="text-xs tracking-widest text-charcoal block mb-1.5">EMAIL *</label>
                  <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="ama@email.com"
                    className="w-full border border-stone px-4 py-2.5 text-sm outline-none focus:border-bronze transition-colors" />
                </div>

                <div>
                  <label className="text-xs tracking-widest text-charcoal block mb-1.5">PHONE *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full border border-stone px-4 py-2.5 text-sm outline-none focus:border-bronze transition-colors" />
                </div>

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

                {status === "error" && (
                  <p className="text-red-400 text-sm">Payment failed. Please try again.</p>
                )}

                <button type="submit" disabled={status === "sending" || !paystackLoaded}
                  className="w-full bg-charcoal text-ivory text-xs tracking-widest py-4 border-none cursor-pointer hover:bg-bronze transition-colors disabled:opacity-50 mt-2">
                  {status === "sending" ? "OPENING PAYMENT..." : `PAY ₵${Number(totalPrice).toFixed(2)} NOW`}
                </button>

                <p className="text-mist text-xs text-center">
                  🔒 Secured by Paystack · Card, MoMo & Bank accepted
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}