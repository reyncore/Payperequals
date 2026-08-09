"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { DashboardStats } from "@/types";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await globalThis.fetch("/api/user/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch {}
      setLoading(false);
    }
    fetch();
  }, []);

  const STAT_CARDS = [
    {
      label: "Saldo Tersisa",
      value: stats ? formatCurrency(stats.balance) : "...",
      icon: "💰",
      color: "cyan",
      sub: "Gunakan dengan bijak",
      href: "/topup",
    },
    {
      label: "Total Dihabiskan",
      value: stats ? formatCurrency(stats.totalSpent) : "...",
      icon: "💸",
      color: "accent",
      sub: "Kontribusi Anda",
      href: null,
    },
    {
      label: "Total Kalkulasi",
      value: stats ? stats.totalCalculations.toString() : "...",
      icon: "🧮",
      color: "gold",
      sub: "Kali Anda bayar = ",
      href: "/history",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">
          Halo, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="page-subtitle mt-1">
          Selamat datang kembali. Saldo Anda siap untuk dikurangi.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className={`card-gradient-border p-6 transition-all hover:-translate-y-0.5 ${
              card.href ? "cursor-pointer" : ""
            }`}
          >
            {card.href ? (
              <Link href={card.href} className="block">
                <StatCardInner card={card} loading={loading} />
              </Link>
            ) : (
              <StatCardInner card={card} loading={loading} />
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/calculator"
          className="group card-gradient-border p-6 hover:bg-brand-accent/5 transition-all hover:-translate-y-0.5 block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🧮
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Buka Kalkulator</h3>
              <p className="text-brand-text-muted text-sm">Hitung sesuatu yang mahal</p>
            </div>
            <span className="ml-auto text-brand-accent">→</span>
          </div>
        </Link>

        <Link
          href="/topup"
          className="group card-gradient-border p-6 hover:bg-brand-cyan/5 transition-all hover:-translate-y-0.5 block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/15 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💳
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Top Up Saldo</h3>
              <p className="text-brand-text-muted text-sm">Isi ulang dompet digital Anda</p>
            </div>
            <span className="ml-auto text-brand-cyan">→</span>
          </div>
        </Link>
      </div>

      {/* Two-column history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calculations */}
        <div className="card-gradient-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Kalkulasi Terbaru</h2>
            <Link href="/history" className="text-brand-accent text-sm hover:underline">
              Lihat semua
            </Link>
          </div>

          {loading ? (
            <SkeletonList />
          ) : stats?.recentCalculations.length === 0 ? (
            <EmptyState icon="🧮" text="Belum ada kalkulasi" />
          ) : (
            <div className="space-y-3">
              {stats?.recentCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-white truncate">
                      {calc.expression} = <span className="text-brand-cyan">{calc.result}</span>
                    </p>
                    <p className="text-brand-text-muted text-xs mt-0.5">
                      {formatRelativeTime(calc.createdAt)}
                    </p>
                  </div>
                  <span className="text-brand-accent text-xs font-medium ml-3 shrink-0">
                    -{formatCurrency(calc.cost)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card-gradient-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Transaksi Terbaru</h2>
            <Link href="/history?tab=transactions" className="text-brand-accent text-sm hover:underline">
              Lihat semua
            </Link>
          </div>

          {loading ? (
            <SkeletonList />
          ) : stats?.recentTransactions.length === 0 ? (
            <EmptyState icon="💳" text="Belum ada transaksi" />
          ) : (
            <div className="space-y-3">
              {stats?.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{tx.note ?? tx.type}</p>
                    <p className="text-brand-text-muted text-xs mt-0.5">
                      {formatRelativeTime(tx.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ml-3 shrink-0 ${
                      tx.amount > 0 ? "text-green-400" : "text-brand-accent"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCardInner({
  card,
  loading,
}: {
  card: { icon: string; label: string; value: string; color: string; sub: string };
  loading: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{card.icon}</span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            card.color === "cyan"
              ? "bg-brand-cyan/10 text-brand-cyan"
              : card.color === "accent"
              ? "bg-brand-accent/10 text-brand-accent"
              : "bg-brand-gold/10 text-brand-gold"
          }`}
        >
          Live
        </span>
      </div>
      <p
        className={`font-display font-bold text-2xl mb-1 ${
          loading ? "text-brand-text-muted animate-pulse" : "text-white"
        }`}
      >
        {loading ? "---" : card.value}
      </p>
      <p className="text-brand-text-muted text-xs">{card.label}</p>
      <p className="text-brand-text-muted text-xs opacity-60 mt-0.5">{card.sub}</p>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-8 text-brand-text-muted">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}
