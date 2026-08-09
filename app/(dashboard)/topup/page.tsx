"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { formatCurrency, TOPUP_AMOUNTS } from "@/lib/utils";

const TOPUP_OPTIONS = [
  { amount: 5000, label: "Rp5.000", icon: "☕", note: "Cukup untuk 50 kalkulasi" },
  { amount: 10000, label: "Rp10.000", icon: "🍕", note: "Cukup untuk 100 kalkulasi" },
  { amount: 20000, label: "Rp20.000", icon: "🎮", note: "Cukup untuk 200 kalkulasi", popular: true },
  { amount: 50000, label: "Rp50.000", icon: "🚀", note: "Cukup untuk 500 kalkulasi" },
];

type Step = "select" | "confirm" | "processing" | "success";

export default function TopUpPage() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [newBalance, setNewBalance] = useState<number | null>(null);

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
  }, [session]);

  async function handleTopUp() {
    if (!selected) return;
    setStep("processing");

    // Simulate payment gateway delay
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const res = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selected }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Top up gagal");
        setStep("select");
        return;
      }

      setNewBalance(data.data.balance);
      setBalance(data.data.balance);
      setStep("success");
    } catch {
      toast.error("Koneksi gagal");
      setStep("select");
    }
  }

  function reset() {
    setStep("select");
    setSelected(null);
    setNewBalance(null);
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Top Up Saldo</h1>
        <p className="page-subtitle mt-1">
          Isi ulang saldo untuk melanjutkan kegiatan matematis Anda
        </p>
      </div>

      {/* Current balance */}
      <div className="card-gradient-border p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-cyan/15 flex items-center justify-center text-2xl">
          💰
        </div>
        <div>
          <p className="text-brand-text-muted text-sm">Saldo Saat Ini</p>
          <p className="font-display font-bold text-2xl text-white">
            {balance !== null ? formatCurrency(balance) : "..."}
          </p>
        </div>
      </div>

      {step === "select" && (
        <div className="space-y-4 animate-slide-up">
          <p className="text-white font-medium">Pilih Nominal Top Up</p>

          <div className="grid grid-cols-2 gap-3">
            {TOPUP_OPTIONS.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => setSelected(opt.amount)}
                className={`relative p-4 rounded-2xl text-left transition-all border ${
                  selected === opt.amount
                    ? "bg-brand-accent/15 border-brand-accent/50 glow-accent"
                    : "glass border-white/10 hover:bg-white/8 hover:border-white/20"
                }`}
              >
                {opt.popular && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-brand-gold text-brand-bg text-xs font-bold">
                    POPULER
                  </span>
                )}
                <div className="text-2xl mb-2">{opt.icon}</div>
                <div
                  className={`font-display font-bold text-xl mb-1 ${
                    selected === opt.amount ? "text-brand-accent" : "text-white"
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-brand-text-muted text-xs">{opt.note}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => selected && setStep("confirm")}
            disabled={!selected}
            className="w-full py-4 rounded-2xl bg-brand-accent text-white font-semibold
                       hover:bg-brand-accent-hover disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all hover:shadow-lg hover:shadow-brand-accent/20 mt-2"
          >
            {selected ? `Lanjutkan — ${formatCurrency(selected)}` : "Pilih nominal terlebih dahulu"}
          </button>

          {/* Mock notice */}
          <div className="p-4 rounded-xl bg-brand-gold/5 border border-brand-gold/20 text-center">
            <p className="text-brand-gold text-xs font-medium mb-1">🧪 Mode Simulasi</p>
            <p className="text-brand-text-muted text-xs">
              Ini adalah simulasi pembayaran. Tidak ada uang nyata yang dipotong.
              Sayangnya.
            </p>
          </div>
        </div>
      )}

      {step === "confirm" && selected && (
        <div className="animate-slide-up space-y-4">
          <div className="card-gradient-border p-6 text-center">
            <p className="text-brand-text-muted text-sm mb-1">Anda akan top up sebesar</p>
            <p className="font-display font-bold text-4xl text-brand-gold mb-1">
              {formatCurrency(selected)}
            </p>
            <p className="text-brand-text-muted text-xs">
              Saldo setelah top up:{" "}
              <span className="text-white">
                {balance !== null ? formatCurrency(balance + selected) : "..."}
              </span>
            </p>
          </div>

          {/* Fake payment method */}
          <div className="glass rounded-2xl p-5 border border-white/10">
            <p className="text-white font-medium text-sm mb-4">Metode Pembayaran</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-brand-cyan/20">
              <div className="w-10 h-6 rounded bg-brand-cyan/20 flex items-center justify-center text-brand-cyan text-xs font-bold">
                💳
              </div>
              <div>
                <p className="text-white text-sm font-medium">Mock Payment Gateway</p>
                <p className="text-brand-text-muted text-xs">Pembayaran simulasi — selalu berhasil</p>
              </div>
              <span className="ml-auto text-green-400 text-xs">✓ Aktif</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
            >
              Kembali
            </button>
            <button
              onClick={handleTopUp}
              className="flex-1 py-3 rounded-xl bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover transition-all hover:shadow-lg hover:shadow-brand-accent/20"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="animate-fade-in card-gradient-border p-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-brand-accent/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-accent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">💳</div>
            </div>
            <div>
              <p className="font-display font-semibold text-white text-lg">Memproses Pembayaran</p>
              <p className="text-brand-text-muted text-sm mt-1">Sedang menghubungi bank yang tidak ada...</p>
            </div>
          </div>
        </div>
      )}

      {step === "success" && newBalance !== null && (
        <div className="animate-slide-up card-gradient-border p-10 text-center glow-cyan">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Top Up Berhasil!
          </h2>
          <p className="text-brand-text-muted text-sm mb-4">
            Saldo baru Anda:
          </p>
          <p className="font-display font-bold text-4xl text-brand-cyan text-glow-cyan mb-6">
            {formatCurrency(newBalance)}
          </p>
          <p className="text-brand-text-muted text-xs mb-8">
            Sekarang Anda bisa menghitung{" "}
            <span className="text-white font-medium">
              {Math.floor(newBalance / 100)} kalkulasi
            </span>{" "}
            lagi. Gunakan dengan bijak.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
            >
              Top Up Lagi
            </button>
            <a
              href="/calculator"
              className="flex-1 py-3 rounded-xl bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover transition-all text-center"
            >
              Ke Kalkulator
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
