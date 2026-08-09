import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg grid-pattern flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #E94560 0%, transparent 70%)" }}
      />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold flex items-center justify-center text-base font-bold text-white">
          ≡
        </div>
        <span className="font-display font-bold text-white text-xl">
          Pay<span className="text-brand-accent">Per</span>Equals
        </span>
      </Link>

      <div className="w-full max-w-md">{children}</div>

      <p className="mt-8 text-brand-text-muted text-xs text-center">
        Dengan mendaftar, Anda setuju bahwa matematika itu mahal.
      </p>
    </div>
  );
}
