"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/lib/data";

const EMOJIS = ["🌹","🌸","🌿","🍊","🖤","✨","🌊","🌑","🌺","🌻","🌾","🍋"];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Categories from Supabase
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  const [form, setForm] = useState({
    name: "",
    family: "",
    price: "",
    badge: "" as string,
    notes: "",
    emoji: "🌸",
    image: "",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // Load categories from Supabase on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const names = data.map((c: { name: string }) => c.name);
        setCategories(names);
        if (names.length > 0) set("family", names[0]);
      });
  }, []);

  async function handleAddCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      set("family", trimmed);
      setNewCategory("");
      setShowAddCategory(false);
      return;
    }

    setAddingCategory(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });

    if (res.ok) {
      setCategories((c) => [...c, trimmed]);
      set("family", trimmed);
      setNewCategory("");
      setShowAddCategory(false);
    } else {
      setError("Failed to save category.");
    }
    setAddingCategory(false);
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10MB."); return; }

    setError("");
    setUploading(true);
    setUploadProgress(20);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

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
      setError("Upload failed. Check your Cloudinary credentials.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    if (!form.family) { setError("Please select or create a category."); return; }

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
            {form.image && <span className="ml-2 text-[#7a8f7a] normal-case tracking-normal font-normal">✓ Uploaded</span>}
          </label>
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onDragOver={(e) => e.preventDefault()}
            className={`relative border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${uploading ? "border-[#b8916a]" : "border-[#e8e2d9] hover:border-[#b8916a]"}`}
            style={{ minHeight: 200 }}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 max-w-full object-contain p-2" />
            ) : (
              <div className="text-center p-8">
                <p className="text-4xl mb-3">🖼️</p>
                <p className="text-[#9e9890] text-sm">Drag & drop or click to upload</p>
                <p className="text-[#9e9890] text-xs mt-1">PNG, JPG, WEBP · Max 10MB</p>
              </div>
            )}
            {uploading && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#e8e2d9]">
                <div className="h-full bg-[#b8916a] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>
          {uploading && <p className="text-[#b8916a] text-xs mt-2">Uploading...</p>}
          {preview && !uploading && (
            <button type="button" onClick={() => { setPreview(null); set("image", ""); if (inputRef.current) inputRef.current.value = ""; }}
              className="text-[#9e9890] text-xs mt-2 bg-transparent border-none cursor-pointer hover:text-red-400">
              Remove image
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
        </div>

        {/* Emoji */}
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

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[#9e9890] text-xs tracking-widest">CATEGORY *</label>
              <button type="button" onClick={() => setShowAddCategory((v) => !v)}
                className="text-[#b8916a] text-xs bg-transparent border-none cursor-pointer hover:underline">
                + Create new
              </button>
            </div>

            {showAddCategory && (
              <div className="flex gap-2 mb-3">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                  placeholder="e.g. Amber, Musk, Fresh..."
                  className="flex-1 border border-[#b8916a] px-3 py-2 text-sm outline-none"
                  autoFocus
                />
                <button type="button" onClick={handleAddCategory} disabled={addingCategory}
                  className="bg-[#b8916a] text-white text-xs px-4 py-2 border-none cursor-pointer hover:bg-[#d4aa88] transition-colors disabled:opacity-50">
                  {addingCategory ? "..." : "Save"}
                </button>
                <button type="button" onClick={() => { setShowAddCategory(false); setNewCategory(""); }}
                  className="bg-transparent border border-[#e8e2d9] text-[#9e9890] text-xs px-3 py-2 cursor-pointer">
                  ✕
                </button>
              </div>
            )}

            {categories.length === 0 ? (
              <p className="text-[#9e9890] text-xs py-3">No categories yet — create your first one above.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} type="button" onClick={() => set("family", cat)}
                    className={`text-xs px-3 py-1.5 border transition-colors cursor-pointer ${
                      form.family === cat
                        ? "bg-[#1c1b19] border-[#1c1b19] text-white"
                        : "bg-transparent border-[#e8e2d9] text-[#1c1b19] hover:border-[#b8916a]"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
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

        <div className="flex gap-3 pb-8">
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