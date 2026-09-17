"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { label: "Products", href: "/admin/products", icon: "🧴" },
  { label: "Add New",  href: "/admin/products/new", icon: "＋" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#1c1b19] flex flex-col z-40">
      <div className="px-6 py-7 border-b border-[#2e2a24]">
        <p className="font-playfair text-[#f7f2ea] text-xl tracking-widest">FORIANN</p>
        <p className="text-[#9e9890] text-[10px] tracking-[.2em] mt-0.5">ADMIN</p>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {NAV.map(({ label, href, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors no-underline ${
                active ? "bg-[#b8916a] text-[#f7f2ea]" : "text-[#9e9890] hover:text-[#f7f2ea] hover:bg-[#2e2a24]"
              }`}>
              <span>{icon}</span>{label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-[#2e2a24]">
        <a href="/" className="flex items-center gap-3 px-4 py-2 text-[#9e9890] text-sm hover:text-[#f7f2ea] transition-colors no-underline mb-1">
          <span>🏪</span> View Store
        </a>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-[#9e9890] text-sm hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer w-full text-left">
          <span>↩</span> Logout
        </button>
      </div>
    </aside>
  );
}