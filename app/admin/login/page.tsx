"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#1c1b19] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-playfair text-[#f7f2ea] text-3xl tracking-widest mb-2">SILLAGE</p>
          <p className="text-[#9e9890] text-xs tracking-[.2em]">ADMIN PORTAL</p>
        </div>

        <div className="bg-[#2e2a24] p-8">
          <h1 className="text-[#f7f2ea] text-sm tracking-widest mb-6">SIGN IN</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[#9e9890] text-xs tracking-widest block mb-1.5">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#1c1b19] text-[#f7f2ea] text-sm px-4 py-3 outline-none border border-transparent focus:border-[#b8916a] transition-colors placeholder-[#9e9890]"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="text-[#9e9890] text-xs tracking-widest block mb-1.5">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1c1b19] text-[#f7f2ea] text-sm px-4 py-3 outline-none border border-transparent focus:border-[#b8916a] transition-colors placeholder-[#9e9890]"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b8916a] text-[#f7f2ea] text-xs tracking-widest py-3.5 mt-2 border-none cursor-pointer hover:bg-[#d4aa88] transition-colors disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>

        <p className="text-[#9e9890] text-xs text-center mt-6">
          <a href="/" className="hover:text-[#b8916a] transition-colors">← Back to store</a>
        </p>
      </div>
    </div>
  );
}