"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/calculator", label: "Kalkulator", icon: "🧮" },
  { href: "/topup", label: "Top Up", icon: "💳" },
  { href: "/history", label: "Riwayat", icon: "📋" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/profile", label: "Profil & Badge", icon: "👤" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setBalance(data.data?.balance ?? 0);
        }
      } catch {}
    }
    if (session) fetchBalance();
  }, [session, pathname]);

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed left-0 top-0 h-full border-r border-white/5 bg-brand-surface z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold flex items-center justify-center text-sm font-bold text-white">
              ≡
            </div>
            <span className="font-display font-bold text-white text-base">
              Pay<span className="text-brand-accent">Per</span>Equals
            </span>
          </Link>
        </div>

        {/* Balance Card */}
        <div className="p-4">
          <div className="rounded-xl p-4 bg-gradient-to-br from-brand-accent/15 to-brand-card border border-brand-accent/20">
            <p className="text-brand-text-muted text-xs mb-1">Saldo</p>
            <p className="font-display font-bold text-xl text-white">
              {balance !== null ? formatCurrency(balance) : "..."}
            </p>
            <Link
              href="/topup"
              className="mt-2 block text-center text-xs py-1.5 rounded-lg bg-brand-accent/80 hover:bg-brand-accent text-white font-medium transition-colors"
            >
              + Top Up
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/20"
                    : "text-brand-text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === "/admin"
                  ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/20"
                  : "text-brand-text-muted hover:text-brand-gold hover:bg-brand-gold/5"
              }`}
            >
              <span className="text-base">👑</span>
              Admin
            </Link>
          )}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-sm">
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-brand-text-muted text-xs truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-2 rounded-xl text-brand-text-muted hover:text-white hover:bg-white/5
                       text-sm font-medium transition-all text-left px-3 flex items-center gap-2"
          >
            <span>⟵</span> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-14 flex items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold flex items-center justify-center text-xs font-bold text-white">≡</div>
          <span className="font-display font-bold text-white text-sm">Pay<span className="text-brand-accent">Per</span>Equals</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-brand-bg/95 backdrop-blur-md pt-14">
          <div className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === item.href
                    ? "bg-brand-accent/15 text-brand-accent"
                    : "text-brand-text-muted"
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-4 py-3 text-brand-text-muted text-sm"
            >
              <span>⟵</span> Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
