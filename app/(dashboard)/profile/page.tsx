"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Achievement } from "@/lib/utils";
import { computeAchievements } from "@/lib/utils";

type Tab = "info" | "password" | "achievements" | "danger";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [tab, setTab] = useState<Tab>("info");
  const [loading, setLoading] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementStats, setAchievementStats] = useState<{ unlockedCount: number; total: number } | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    balance: number;
    role: string;
    createdAt: string;
    totalCalculations: number;
    totalSpent: number;
  } | null>(null);

  // Forms
  const [name, setName] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, dashRes, achRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/user/dashboard"),
          fetch("/api/achievements"),
        ]);
        if (userRes.ok) {
          const d = await userRes.json();
          setUserData(prev => ({ ...prev!, ...d.data }));
          setName(d.data.name);
        }
        if (dashRes.ok) {
          const d = await dashRes.json();
          setUserData(prev => prev ? ({
            ...prev,
            totalCalculations: d.data.totalCalculations,
            totalSpent: d.data.totalSpent,
          }) : null);
        }
        if (achRes.ok) {
          const d = await achRes.json();
          setAchievements(d.data.achievements);
          setAchievementStats({ unlockedCount: d.data.unlockedCount, total: d.data.total });
        }
      } catch {}
    }
    loadData();
  }, []);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name === session?.user?.name) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      await update({ name });
      toast.success("Nama berhasil diubah!");
    } catch { toast.error("Gagal mengubah nama"); }
    setLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast.error("Password baru tidak cocok"); return; }
    if (passwords.new.length < 6) { toast.error("Password minimal 6 karakter"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password berhasil diubah! 🔐");
    } catch { toast.error("Gagal mengubah password"); }
    setLoading(false);
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirm !== "HAPUS AKUN SAYA") {
      toast.error('Ketik "HAPUS AKUN SAYA" untuk konfirmasi');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); setLoading(false); return; }
      toast.success("Akun dihapus. Semoga angka-angkamu bahagia di alam lain. 👋");
      await signOut({ callbackUrl: "/" });
    } catch { toast.error("Gagal menghapus akun"); setLoading(false); }
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "info", label: "Info", icon: "👤" },
    { id: "password", label: "Password", icon: "🔐" },
    { id: "achievements", label: "Badge", icon: "🏆" },
    { id: "danger", label: "Hapus Akun", icon: "💀" },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Profil Saya</h1>
        <p className="page-subtitle mt-1">Kelola akun dan pantau pencapaian Anda</p>
      </div>

      {/* User card */}
      <div className="card-gradient-border p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-2xl border border-brand-accent/30">
          {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-xl text-white">{session?.user?.name}</h2>
          <p className="text-brand-text-muted text-sm">{session?.user?.email}</p>
          <div className="flex items-center gap-3 mt-2">
            {userData && (
              <>
                <span className="badge badge-info">{formatCurrency(userData.balance)} saldo</span>
                <span className="badge badge-danger">{userData.totalCalculations} kalkulasi</span>
                {achievementStats && (
                  <span className="badge badge-gold">{achievementStats.unlockedCount}/{achievementStats.total} badge</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl glass mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              tab === t.id
                ? t.id === "danger"
                  ? "bg-brand-accent text-white"
                  : "bg-brand-accent text-white"
                : "text-brand-text-muted hover:text-white"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "info" && (
        <div className="card-gradient-border p-6 animate-slide-up">
          <h3 className="font-display font-semibold text-white mb-5">Ubah Nama</h3>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-muted mb-2">Nama</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-muted mb-2">Email</label>
              <input type="email" value={session?.user?.email ?? ""} disabled className="input-field opacity-50 cursor-not-allowed" />
              <p className="text-brand-text-muted text-xs mt-1">Email tidak bisa diubah</p>
            </div>
            {userData && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-brand-text-muted text-xs mb-1">Total Dihabiskan</p>
                  <p className="font-display font-bold text-brand-accent">{formatCurrency(userData.totalSpent)}</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-brand-text-muted text-xs mb-1">Bergabung Sejak</p>
                  <p className="font-display font-bold text-brand-cyan text-sm">{userData.createdAt ? formatDate(userData.createdAt) : "-"}</p>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !name.trim() || name === session?.user?.name}
              className="w-full py-3 rounded-xl bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover disabled:opacity-40 transition-all"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      )}

      {tab === "password" && (
        <div className="card-gradient-border p-6 animate-slide-up">
          <h3 className="font-display font-semibold text-white mb-5">Ganti Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: "Password Saat Ini", key: "current" },
              { label: "Password Baru", key: "new" },
              { label: "Konfirmasi Password Baru", key: "confirm" },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-brand-text-muted mb-2">{field.label}</label>
                <input
                  type="password"
                  value={passwords[field.key as keyof typeof passwords]}
                  onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                  minLength={field.key !== "current" ? 6 : undefined}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
              className="w-full py-3 rounded-xl bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover disabled:opacity-40 transition-all"
            >
              {loading ? "Memproses..." : "Ganti Password"}
            </button>
          </form>
        </div>
      )}

      {tab === "achievements" && (
        <div className="animate-slide-up space-y-3">
          {achievementStats && (
            <div className="card-gradient-border p-4 flex items-center gap-4 mb-4">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="font-display font-bold text-white text-lg">{achievementStats.unlockedCount} / {achievementStats.total} Terbuka</p>
                <div className="w-48 h-2 rounded-full bg-white/10 mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-gold transition-all"
                    style={{ width: `${(achievementStats.unlockedCount / achievementStats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          {achievements.map(a => (
            <div
              key={a.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                a.unlocked
                  ? "bg-brand-gold/5 border-brand-gold/30"
                  : "glass border-white/5 opacity-50"
              }`}
            >
              <div className={`text-3xl ${!a.unlocked ? "grayscale" : ""}`}>{a.icon}</div>
              <div className="flex-1">
                <p className={`font-semibold ${a.unlocked ? "text-white" : "text-brand-text-muted"}`}>{a.name}</p>
                <p className="text-brand-text-muted text-sm">{a.description}</p>
              </div>
              {a.unlocked
                ? <span className="badge badge-gold">✓ Terbuka</span>
                : <span className="badge badge-info">🔒 Terkunci</span>}
            </div>
          ))}
        </div>
      )}

      {tab === "danger" && (
        <div className="card-gradient-border p-6 border-brand-accent/30 animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-display font-semibold text-brand-accent">Hapus Akun</h3>
          </div>
          <p className="text-brand-text-muted text-sm mb-6">
            Tindakan ini <strong className="text-white">permanen dan tidak bisa dibatalkan</strong>.
            Seluruh data, saldo, dan riwayat kalkulasi Anda akan dihapus. Bahkan angka 2+2 yang pernah Anda bayar itu.
          </p>
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-muted mb-2">Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="input-field"
                placeholder="Masukkan password Anda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-muted mb-2">
                Ketik <code className="text-brand-accent">HAPUS AKUN SAYA</code> untuk konfirmasi
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                className="input-field"
                placeholder="HAPUS AKUN SAYA"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !deletePassword || deleteConfirm !== "HAPUS AKUN SAYA"}
              className="w-full py-3 rounded-xl bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover disabled:opacity-40 transition-all"
            >
              {loading ? "Menghapus..." : "💀 Hapus Akun Selamanya"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
