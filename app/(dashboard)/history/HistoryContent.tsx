"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Transaction, Calculation } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

type Tab = "calculations" | "transactions";

export default function HistoryContent() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(
    (params.get("tab") as Tab) ?? "calculations"
  );
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    setCalculations([]);
    setTransactions([]);
    setHasMore(true);
    fetchData(tab, 1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function fetchData(type: Tab, pageNum: number, reset = false) {
    setLoading(true);
    try {
      const url =
        type === "calculations"
          ? `/api/calculations?page=${pageNum}&limit=15`
          : `/api/transactions?page=${pageNum}&limit=15`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (type === "calculations") {
          setCalculations((prev) =>
            reset ? data.data.items : [...prev, ...data.data.items]
          );
          setHasMore(data.data.hasMore);
        } else {
          setTransactions((prev) =>
            reset ? data.data.items : [...prev, ...data.data.items]
          );
          setHasMore(data.data.hasMore);
        }
      }
    } catch {}
    setLoading(false);
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    fetchData(tab, next);
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Riwayat</h1>
        <p className="page-subtitle mt-1">
          Catatan lengkap pengeluaran matematis Anda
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl glass w-fit mb-6">
        {(["calculations", "transactions"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t
                ? "bg-brand-accent text-white"
                : "text-brand-text-muted hover:text-white"
            }`}
          >
            {t === "calculations" ? "🧮 Kalkulasi" : "💳 Transaksi"}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "calculations" && (
        <CalculationsTable items={calculations} loading={loading} />
      )}
      {tab === "transactions" && (
        <TransactionsTable items={transactions} loading={loading} />
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
          >
            Muat lebih banyak
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 flex justify-center">
          <svg className="animate-spin w-5 h-5 text-brand-accent" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

function CalculationsTable({ items, loading }: { items: Calculation[]; loading: boolean }) {
  if (!loading && items.length === 0) {
    return (
      <div className="card-gradient-border p-16 text-center">
        <div className="text-4xl mb-3">🧮</div>
        <p className="text-white font-medium mb-1">Belum ada kalkulasi</p>
        <p className="text-brand-text-muted text-sm">
          Pergi ke kalkulator dan habiskan saldo Anda
        </p>
      </div>
    );
  }

  return (
    <div className="card-gradient-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {["Ekspresi", "Hasil", "Biaya", "Waktu"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && items.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded bg-white/5 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : items.map((calc) => (
                  <tr key={calc.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-white">
                      {calc.expression}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-brand-cyan font-bold">
                      = {calc.result}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-accent">
                      -{formatCurrency(calc.cost)}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">
                      {formatDate(calc.createdAt)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionsTable({ items, loading }: { items: Transaction[]; loading: boolean }) {
  if (!loading && items.length === 0) {
    return (
      <div className="card-gradient-border p-16 text-center">
        <div className="text-4xl mb-3">💳</div>
        <p className="text-white font-medium mb-1">Belum ada transaksi</p>
        <p className="text-brand-text-muted text-sm">
          Lakukan top up untuk memulai
        </p>
      </div>
    );
  }

  return (
    <div className="card-gradient-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {["Keterangan", "Tipe", "Jumlah", "Waktu"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && items.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded bg-white/5 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : items.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">
                      {tx.note ?? (tx.type === "TOPUP" ? "Top Up" : "Kalkulasi")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${
                          tx.type === "TOPUP" ? "badge-success" : "badge-danger"
                        }`}
                      >
                        {tx.type === "TOPUP" ? "↑ Top Up" : "↓ Kalkulasi"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-mono font-bold ${
                        tx.amount > 0 ? "text-green-400" : "text-brand-accent"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
