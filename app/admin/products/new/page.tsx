"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SCENT_FAMILIES, ScentFamily, Badge } from "@/lib/data";

const EMOJIS = ["🌹","🌸","🌿","🍊","🖤","✨","🌊","🌑","🌺","🌻","🌾","🍋"];
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    family: "floral" as Exclude<ScentFamily, "all">,
    price: "",
    badge: "" as Badge | "",
    notes: "",
    emoji: "🌸",
    image: "",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10MB."); return; }

    setError("");
    setUploading(true);
    setUploadProgress(20);

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploadProgress(40);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(60);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      setUploadProgress(90);

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      set("image", data.url);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 600);
    } catch {
      setError("Upload failed. Check your Cloudinary credentials in .env.local");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) { setError("Name and price are required."); return; }

    setSaving(true);
    setError("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        badge: form.badge || null,
        notes: form.notes.split(",").map((n) => n.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      setError("Failed to save product.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-[#9e9890] text-sm bg-transparent border-none cursor-pointer hover:text-[#1c1b19]">←</button>
        <div>
          <h1 className="font-playfair text-3xl text-[#1c1b19]">Add Product</h1>
          <p className="text-[#9e9890] text-sm mt-1">Fill in details and upload a product image</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Image Upload */}
        <div className="bg-white p-6">
          <label className="text-[#1c1b19] text-xs tracking-widest block mb-3">
            PRODUCT IMAGE
            {form.image && <span className="ml-2 text-[#7a8f7a] normal-case tracking-normal font-normal">✓ Uploaded to Cloudinary</span>}
          </label>

          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onDragOver={(e) => e.preventDefault()}
            className={`relative border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
              uploading ? "border-[#b8916a]" : "border-[#e8e2d9] hover:border-[#b8916a]"
            }`}
            style={{ minHeight: 200 }}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 max-w-full object-contain p-2" />
            ) : (
              <div className="text-center p-8">
                <p className="text-4xl mb-3">🖼️</p>
                <p className="text-[#9e9890] text-sm">Drag & drop or click to upload</p>
                <p className="text-[#9e9890] text-xs mt-1">PNG, JPG, WEBP · Max 10MB</p>
                <p className="text-[#b8916a] text-xs mt-2">Uploads to Cloudinary ({CLOUD_NAME})</p>
              </div>
            )}

            {/* Progress bar */}
            {uploading && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#e8e2d9]">
                <div className="h-full bg-[#b8916a] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

          {uploading && <p className="text-[#b8916a] text-xs mt-2">Uploading to Cloudinary…</p>}
          {preview && !uploading && (
            <button
              type="button"
              onClick={() => { setPreview(null); set("image", ""); if (inputRef.current) inputRef.current.value = ""; }}
              className="text-[#9e9890] text-xs mt-2 bg-transparent border-none cursor-pointer hover:text-red-400"
            >
              Remove image
            </button>
          )}

          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
        </div>

        {/* Emoji fallback */}
        <div className="bg-white p-6">
          <label className="text-[#1c1b19] text-xs tracking-widest block mb-3">
            EMOJI FALLBACK <span className="text-[#9e9890] normal-case font-normal tracking-normal">(shown if no image)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button key={e} type="button" onClick={() => set("emoji", e)}
                className={`text-2xl p-2 border transition-colors cursor-pointer bg-transparent ${form.emoji === e ? "border-[#b8916a] bg-[#faf7f3]" : "border-[#e8e2d9] hover:border-[#b8916a]"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white p-6 flex flex-col gap-4">
          <label className="text-[#1c1b19] text-xs tracking-widest block">DETAILS</label>

          <div>
            <label className="text-[#9e9890] text-xs tracking-widest block mb-1.5">NAME *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Rose Éternelle"
              className="w-full border border-[#e8e2d9] px-4 py-2.5 text-sm outline-none focus:border-[#b8916a] transition-colors" />
          </div>

          <div>
            <label className="text-[#9e9890] text-xs tracking-widest block mb-1.5">PRICE (₵) *</label>
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" min="0" step="0.01"
              className="w-full border border-[#e8e2d9] px-4 py-2.5 text-sm outline-none focus:border-[#b8916a] transition-colors" />
          </div>

          <div>
            <label className="text-[#9e9890] text-xs tracking-widest block mb-1.5">SCENT FAMILY *</label>
            <select value={form.family} onChange={(e) => set("family", e.target.value)}
              className="w-full border border-[#e8e2d9] px-4 py-2.5 text-sm outline-none focus:border-[#b8916a] transition-colors bg-white">
              {SCENT_FAMILIES.filter((f) => f.value !== "all").map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#9e9890] text-xs tracking-widest block mb-1.5">BADGE</label>
            <select value={form.badge} onChange={(e) => set("badge", e.target.value)}
              className="w-full border border-[#e8e2d9] px-4 py-2.5 text-sm outline-none focus:border-[#b8916a] transition-colors bg-white">
              <option value="">None</option>
              <option value="new">New</option>
              <option value="best">Bestseller</option>
              <option value="ltd">Limited</option>
            </select>
          </div>

          <div>
            <label className="text-[#9e9890] text-xs tracking-widest block mb-1.5">
              SCENT NOTES <span className="normal-case font-normal tracking-normal">(comma-separated)</span>
            </label>
            <input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. Rose, Peony, White Musk"
              className="w-full border border-[#e8e2d9] px-4 py-2.5 text-sm outline-none focus:border-[#b8916a] transition-colors" />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading}
            className="bg-[#1c1b19] text-[#f7f2ea] text-xs tracking-widest px-8 py-3.5 border-none cursor-pointer hover:bg-[#b8916a] transition-colors disabled:opacity-50">
            {saving ? "SAVING..." : "SAVE PRODUCT"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="bg-transparent text-[#9e9890] text-xs tracking-widest px-6 py-3.5 border border-[#e8e2d9] cursor-pointer hover:border-[#1c1b19] hover:text-[#1c1b19] transition-colors">
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}