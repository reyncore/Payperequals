"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminStats } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    async function fetchStats() {
      try {
        const res = await fetch("/api/admin");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch {}
      setLoading(false);
    }

    fetchStats();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-brand-accent" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  const STAT_CARDS = [
    {
      label: "Total User",
      value: stats?.totalUsers.toString() ?? "0",
      icon: "👥",
      color: "cyan",
    },
    {
      label: "Total Transaksi",
      value: stats?.totalTransactions.toString() ?? "0",
      icon: "💳",
      color: "gold",
    },
    {
      label: "Total Pendapatan",
      value: stats ? formatCurrency(stats.totalRevenue) : "Rp0",
      icon: "💰",
      color: "accent",
    },
    {
      label: "Total Kalkulasi",
      value: stats?.totalCalculations.toString() ?? "0",
      icon: "🧮",
      color: "cyan",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg grid-pattern">
      {/* Admin nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-14 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold flex items-center justify-center text-xs font-bold text-white">≡</div>
            <span className="font-display font-bold text-white text-sm">Pay<span className="text-brand-accent">Per</span>Equals</span>
          </Link>
          <span className="badge badge-gold">ADMIN</span>
        </div>
        <Link href="/dashboard" className="text-brand-text-muted hover:text-white text-sm transition-colors">
          ← Dashboard User
        </Link>
      </nav>

      <div className="pt-20 pb-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-white mb-1">
            👑 Admin Dashboard
          </h1>
          <p className="text-brand-text-muted">
            Pantau kerajaan matematika berbayar Anda
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="card-gradient-border p-5">
              <div className="text-2xl mb-3">{card.icon}</div>
              <p
                className={`font-display font-bold text-2xl mb-1 ${
                  card.color === "accent"
                    ? "text-brand-accent"
                    : card.color === "gold"
                    ? "text-brand-gold"
                    : "text-brand-cyan"
                }`}
              >
                {card.value}
              </p>
              <p className="text-brand-text-muted text-xs">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="card-gradient-border overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-display font-semibold text-white">Daftar Pengguna</h2>
            <p className="text-brand-text-muted text-sm">
              {stats?.totalUsers ?? 0} pengguna terdaftar
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Nama", "Email", "Saldo", "Role", "Transaksi", "Kalkulasi", "Bergabung"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-brand-cyan">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={user.role === "ADMIN" ? "badge badge-gold" : "badge badge-info"}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">
                      {user._count.transactions}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">
                      {user._count.calculations}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fun admin note */}
        <div className="mt-6 p-4 rounded-2xl glass border border-brand-gold/20 text-center">
          <p className="text-brand-gold text-sm">
            💡 Fun fact: Total pendapatan dari kalkulasi 2+2 saja sudah mengalahkan startup AI terkemuka.
          </p>
        </div>
      </div>
    </div>
  );
}
