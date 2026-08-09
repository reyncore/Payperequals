import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PRICING = [
  {
    name: "Broke",
    price: "Gratis",
    description: "Untuk mereka yang belum siap berinvestasi di matematika.",
    features: [
      "Tidak bisa menghitung apapun",
      "Hak istimewa melihat kalkulator",
      "Dukungan emosional saja",
      "Bebas menangis",
    ],
    cta: "Mulai Tidak Menghitung",
    highlight: false,
    badge: null,
  },
  {
    name: "Premium Mati-matian",
    price: "Rp100",
    period: "per kalkulasi",
    description: "Untuk profesional yang menghargai setiap angka.",
    features: [
      "Semua operasi dasar",
      "Fungsi trigonometri",
      "Riwayat kalkulasi",
      "Pesan motivasi gratis",
      "Kepuasan moral",
    ],
    cta: "Bayar dan Hitung",
    highlight: true,
    badge: "TERPOPULER",
  },
  {
    name: "Enterprise",
    price: "Hubungi Kami",
    description: "Untuk perusahaan besar yang butuh banyak kalkulasi mahal.",
    features: [
      "Semua fitur Premium",
      "Diskon volume (mungkin)",
      "Manajer akun khusus",
      "Invoice bulanan",
      "Sertifikat 'Pembayar Setia'",
    ],
    cta: "Kami Sudah Kaya",
    highlight: false,
    badge: "LANGKA",
  },
];

const FAQ = [
  {
    q: "Kenapa saya harus membayar untuk kalkulator?",
    a: "Pertanyaan bagus! Kami juga tidak tahu. Tapi sudah terlanjur dibuat dan investor kami berharap ini jadi unicorn.",
  },
  {
    q: "Apakah 2 + 2 = 4 masih seharga Rp100?",
    a: "Ya. Bahkan kami sempat mempertimbangkan harga premium untuk jawaban yang sudah terlalu jelas ini. Tapi tidak jadi.",
  },
  {
    q: "Kenapa hitung di server, bukan browser?",
    a: "Supaya Anda tidak bisa mengakali kami. Kami tahu Anda sudah buka inspect element.",
  },
  {
    q: "Ada refund jika hasilnya salah?",
    a: "Tidak. Tapi kami bisa menyalahkan mathjs atas nama Anda dengan biaya tambahan.",
  },
  {
    q: "Bagaimana cara top up?",
    a: "Sangat mudah. Klik Top Up, pilih nominal, konfirmasi, dan saldo bertambah. Seperti magic — tapi dompet Anda yang merasakan efeknya.",
  },
  {
    q: "Apakah ada free trial?",
    a: "Tidak. Namun kami menawarkan 'imaginary free trial' — bayangkan saja Anda sedang mencoba gratis. Efeknya hampir sama.",
  },
  {
    q: "Bagaimana jika saya kehabisan saldo di tengah kalkulasi panjang?",
    a: "Anda tidak akan mendapat hasilnya. Matematika tidak berbelas kasihan, dan kami pun tidak.",
  },
  {
    q: "Apakah data kalkulasi saya aman?",
    a: "Tentu. Kami menyimpan '2 + 2' Anda dengan enkripsi militer karena angka itu sangat berharga.",
  },
];

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-brand-bg grid-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold flex items-center justify-center text-sm font-bold text-white">
              ≡
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Pay<span className="text-brand-accent">Per</span>Equals
            </span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-brand-text-muted hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/calculator"
                  className="px-4 py-2 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent-hover transition-all hover:shadow-lg hover:shadow-brand-accent/20"
                >
                  Kalkulator
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-brand-text-muted hover:text-white text-sm transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent-hover transition-all hover:shadow-lg hover:shadow-brand-accent/20"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
             style={{ background: "radial-gradient(circle, #E94560 0%, transparent 70%)" }} />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl"
             style={{ background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-accent/30 text-brand-accent text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            World&apos;s First Pay-Per-Calculation SaaS
          </div>

          {/* Main headline */}
          <h1 className="font-display font-bold text-white mb-6 leading-tight animate-slide-up"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.1 }}>
            Why calculate{" "}
            <span className="relative">
              <span className="text-brand-accent" style={{ textShadow: "0 0 40px rgba(233,69,96,0.4)" }}>
                for free
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M0 4 Q75 0 150 4 Q225 8 300 4" stroke="#E94560" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </span>
            <br />
            when you can{" "}
            <span className="text-brand-gold" style={{ textShadow: "0 0 40px rgba(255,215,0,0.4)" }}>
              pay
            </span>{" "}
            for every result?
          </h1>

          <p className="text-brand-text-muted text-xl max-w-2xl mx-auto mb-10 animate-fade-in">
            Kalkulator canggih dengan sistem pembayaran revolusioner.{" "}
            <strong className="text-white">Rp100 per kalkulasi.</strong>{" "}
            Karena angka-angka ini tidak menghitung dirinya sendiri.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href={session ? "/calculator" : "/register"}
              className="group relative px-8 py-4 rounded-2xl bg-brand-accent text-white font-semibold text-lg
                         hover:bg-brand-accent-hover transition-all duration-200
                         hover:shadow-[0_0_40px_rgba(233,69,96,0.4)]"
            >
              <span className="relative z-10">
                {session ? "Mulai Menghitung 🧮" : "Start Calculating 🧮"}
              </span>
            </Link>
            <Link
              href="#pricing"
              className="px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-lg
                         hover:bg-white/10 transition-all duration-200"
            >
              Lihat Harga 💸
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "Rp100", label: "per kalkulasi" },
              { value: "∞", label: "ekspresi didukung" },
              { value: "0%", label: "refund rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-3xl text-white">{stat.value}</div>
                <div className="text-brand-text-muted text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating calculator preview */}
        <div className="max-w-xs mx-auto mt-16 animate-float">
          <div className="card-gradient-border p-5 glow-accent">
            <div className="bg-brand-bg/50 rounded-xl p-4 mb-4 text-right">
              <div className="text-brand-text-muted text-sm font-mono">2 + 2</div>
              <div className="text-brand-cyan font-mono text-4xl font-bold text-glow-cyan">4</div>
            </div>
            <div className="flex items-center justify-between text-xs text-brand-text-muted">
              <span>💸 Rp100 dikurangi</span>
              <span className="text-brand-accent font-medium">Saldo: Rp4.900</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Cara Kerja Yang{" "}
              <span className="text-brand-accent">Sangat Masuk Akal</span>
            </h2>
            <p className="text-brand-text-muted">Proses yang transparan dan adil untuk semua pihak (terutama kami)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: "📝",
                step: "01",
                title: "Ketik Ekspresi",
                desc: "Masukkan angka dan operator seperti kalkulator biasa. Gratis, untuk sekarang.",
              },
              {
                icon: "💳",
                step: "02",
                title: "Tekan Tombol =",
                desc: "Saat Anda menekan =, backend kami siap memproses pembayaran Anda.",
              },
              {
                icon: "💸",
                step: "03",
                title: "Saldo Berkurang",
                desc: "Rp100 otomatis dipotong. Server kami bekerja keras untuk 0.001 detik ini.",
              },
              {
                icon: "✨",
                step: "04",
                title: "Hasil Muncul",
                desc: "Nikmati hasil kalkulasi eksklusif yang sudah Anda bayar dengan harga premium.",
              },
            ].map((step) => (
              <div key={step.step} className="glass rounded-2xl p-6 text-center hover:bg-white/8 transition-all">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-brand-accent text-xs font-mono font-bold mb-2">{step.step}</div>
                <h3 className="font-display font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-brand-text-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Harga Yang{" "}
              <span className="text-brand-gold">Sangat Terjangkau</span>
            </h2>
            <p className="text-brand-text-muted">Pilih paket yang sesuai dengan kemampuan kalkulator Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col transition-all hover:-translate-y-1 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-brand-accent/20 to-brand-card border border-brand-accent/40 glow-accent"
                    : "glass hover:bg-white/8"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-accent text-white text-xs font-bold">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-white mb-1">{plan.name}</h3>
                  <p className="text-brand-text-muted text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-display font-bold text-4xl ${plan.highlight ? "text-brand-accent" : "text-white"}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-brand-text-muted text-sm">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-brand-text-muted">
                      <span className={plan.highlight ? "text-brand-accent" : "text-brand-cyan"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Broke" ? "#" : "/register"}
                  className={`w-full py-3 rounded-xl text-center font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-brand-accent hover:bg-brand-accent-hover text-white hover:shadow-lg hover:shadow-brand-accent/30"
                      : "glass border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              FAQ Untuk Mereka Yang{" "}
              <span className="text-brand-cyan">Bertanya-Tanya</span>
            </h2>
            <p className="text-brand-text-muted">Pertanyaan yang sering diajukan, dijawab dengan sangat serius</p>
          </div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="glass rounded-2xl group hover:bg-white/8 transition-all"
              >
                <summary className="px-6 py-4 cursor-pointer text-white font-medium flex items-center justify-between list-none">
                  <span>{item.q}</span>
                  <span className="text-brand-accent text-lg group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-4 text-brand-text-muted text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card-gradient-border p-12">
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Siap Membayar Untuk Menghitung?
            </h2>
            <p className="text-brand-text-muted mb-8">
              Bergabunglah dengan ribuan pengguna yang sudah terlanjur daftar dan tidak bisa refund.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 rounded-2xl bg-brand-accent text-white font-semibold text-lg
                         hover:bg-brand-accent-hover transition-all hover:shadow-[0_0_40px_rgba(233,69,96,0.4)]"
            >
              Daftar Sekarang — Gratis! (Kalkulator-nya tidak)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold flex items-center justify-center text-sm font-bold text-white">
                  ≡
                </div>
                <span className="font-display font-bold text-white">
                  Pay<span className="text-brand-accent">Per</span>Equals
                </span>
              </div>
              <p className="text-brand-text-muted text-sm leading-relaxed max-w-xs">
                Merevolutionary-kan industri kalkulator dengan model bisnis yang belum pernah ada karena memang tidak perlu ada.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Produk</h4>
              <ul className="space-y-2 text-brand-text-muted text-sm">
                <li><Link href="/calculator" className="hover:text-white transition-colors">Kalkulator</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/topup" className="hover:text-white transition-colors">Top Up</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Harga</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Perusahaan</h4>
              <ul className="space-y-2 text-brand-text-muted text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Tentang Kami</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Karir (Tidak Ada)</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Hubungi Kami</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-brand-text-muted text-sm">
              © 2024 PayPerEquals. Hak cipta dilindungi. Refund tidak dilindungi.
            </p>
            <p className="text-brand-text-muted text-xs">
              Ini adalah proyek parodi. Jangan benar-benar investasikan seluruh tabungan Anda.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
