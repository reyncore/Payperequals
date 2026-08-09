"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email.toLowerCase(),
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error || "Login gagal");
      return;
    }

    toast.success("Selamat datang kembali! 🎉");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card-gradient-border p-8 animate-slide-up">
      <div className="mb-8 text-center">
        <h1 className="font-display font-bold text-2xl text-white mb-2">
          Masuk ke Akun Anda
        </h1>
        <p className="text-brand-text-muted text-sm">
          Saldo Anda menunggu untuk dikurangi 💸
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-text-muted mb-2">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text-muted mb-2">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-accent text-white font-semibold
                     hover:bg-brand-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all hover:shadow-lg hover:shadow-brand-accent/20
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Memverifikasi...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Demo credentials */}
      <div className="mt-6 p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20">
        <p className="text-brand-cyan text-xs font-medium mb-2">🧪 Demo Account</p>
        <p className="text-brand-text-muted text-xs">
          Email: <code className="text-white">demo@payperequals.com</code>
          <br />
          Password: <code className="text-white">demo123</code>
        </p>
      </div>

      <p className="mt-6 text-center text-brand-text-muted text-sm">
        Belum punya akun?{" "}
        <Link href="/register" className="text-brand-accent hover:text-brand-accent-hover font-medium">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
