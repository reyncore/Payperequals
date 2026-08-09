"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error("Password tidak cocok");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registrasi gagal");
        setLoading(false);
        return;
      }

      // Auto login after register
      const signInRes = await signIn("credentials", {
        email: form.email.toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        toast.error("Registrasi berhasil, silakan login");
        router.push("/login");
        return;
      }

      toast.success("Akun dibuat! Selamat datang di kehidupan berbayar. 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  }

  return (
    <div className="card-gradient-border p-8 animate-slide-up">
      <div className="mb-8 text-center">
        <h1 className="font-display font-bold text-2xl text-white mb-2">
          Buat Akun Baru
        </h1>
        <p className="text-brand-text-muted text-sm">
          Gratis mendaftar. Menghitungnya yang tidak. 🧮
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-text-muted mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
        </div>

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
            autoComplete="new-password"
            placeholder="Min. 6 karakter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text-muted mb-2">
            Konfirmasi Password
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            placeholder="Ulangi password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
              Membuat akun...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-brand-text-muted text-sm">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-brand-accent hover:text-brand-accent-hover font-medium">
          Masuk
        </Link>
      </p>
    </div>
  );
}
