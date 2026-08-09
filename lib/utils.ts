import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return formatDate(date);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const FUN_MESSAGES = [
  "Terima kasih telah membiayai operasi matematika. 🧮",
  "Angka-angka ini mahal. Tapi Anda berhak mengetahuinya. 💸",
  "Server kami bekerja sangat keras menghitung ini. ⚡",
  "Matematika premium membutuhkan biaya premium. 🏆",
  "Rp100 telah dikurangi. Semoga hasilnya sepadan. 🤞",
  "Tim matematikawan kami telah bekerja keras. 👨‍💻",
  "Kalkulasi berhasil. Dompet Anda mungkin tidak setuju. 😅",
  "Angka telah dihitung dengan sangat hati-hati. 🔢",
  "Terima kasih telah mendukung industri perhitungan. 🎓",
  "Hasil ini eksklusif untukmu. Dan terlampir biayanya. 💎",
  "Kami telah menggunakan 1.21 gigawatt untuk menghitung ini. ⚡",
  "Matematika tidak pernah gratis. Anda tahu sekarang. 📚",
  "Satu kalkulasi telah selesai. Newton akan bangga. 🍎",
  "Transaksi berhasil. Akuntannya sudah update buku besar. 📒",
  "Angka-angka butuh makan juga. Makasih sudah bayar! 🍕",
];

export const SCIENTIFIC_FUN_MESSAGES = [
  "Kalkulator scientific? Dompet Anda butuh konseling. 🧠",
  "Rp200 untuk satu kalkulasi. Trigonometri memang mahal. 📐",
  "Einstein pun tidak sanggup menghitung biayanya. 🌌",
  "Server kami hampir menangis menghitung sin dan cos. 😭",
  "Mode premium aktif. Kantong Anda merasakan perbedaannya. 💀",
];

export function getRandomFunMessage(scientific = false): string {
  const pool = scientific
    ? [...FUN_MESSAGES, ...SCIENTIFIC_FUN_MESSAGES]
    : FUN_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const FREE_MESSAGES = [
  "Kalkulasi GRATIS hari ini! Nikmati selagi bisa. 🎁",
  "Subsidi negara turun! Gratis sekali sehari. 🇮🇩",
  "Hari ini spesial — tanpa biaya. Besok bayar lagi ya. 😊",
  "Kupon gratis harian terpakai. Besok balik lagi! 🎟️",
];

export function getRandomFreeMessage(): string {
  return FREE_MESSAGES[Math.floor(Math.random() * FREE_MESSAGES.length)];
}

export const TOPUP_AMOUNTS = [5000, 10000, 20000, 50000];
export const CALCULATION_COST = 100;
export const SCIENTIFIC_CALCULATION_COST = 200;

// ─── Achievements ─────────────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementInput {
  totalCalculations: number;
  totalSpent: number;
  totalTopups: number;
  scientificCalculations: number;
  freeCalculationsUsed: number;
  joinedAt: string;
}

export function computeAchievements(input: AchievementInput): Achievement[] {
  const {
    totalCalculations,
    totalSpent,
    totalTopups,
    scientificCalculations,
    freeCalculationsUsed,
  } = input;

  return [
    {
      id: "welcome",
      icon: "🎉",
      name: "Selamat Datang",
      description: "Mendaftar dan bergabung dengan komunitas matematika berbayar",
      unlocked: true,
    },
    {
      id: "first_calc",
      icon: "🥇",
      name: "Pertama Kali Bayar",
      description: "Menyelesaikan kalkulasi pertama Anda",
      unlocked: totalCalculations >= 1,
    },
    {
      id: "sultan",
      icon: "💸",
      name: "Sultan Matematika",
      description: "Menghabiskan total Rp10.000 untuk kalkulasi",
      unlocked: totalSpent >= 10000,
    },
    {
      id: "calculator_human",
      icon: "🔢",
      name: "Kalkulator Manusia",
      description: "Menyelesaikan 100 kalkulasi",
      unlocked: totalCalculations >= 100,
    },
    {
      id: "top_up_king",
      icon: "💰",
      name: "Raja Top Up",
      description: "Melakukan top up sebanyak 3 kali atau lebih",
      unlocked: totalTopups >= 3,
    },
    {
      id: "science_nerd",
      icon: "🔬",
      name: "Science Nerd",
      description: "Menggunakan mode scientific calculator sebanyak 10 kali",
      unlocked: scientificCalculations >= 10,
    },
    {
      id: "freeloader",
      icon: "🎟️",
      name: "Kolektor Gratis",
      description: "Menggunakan kalkulasi gratis harian sebanyak 7 kali",
      unlocked: freeCalculationsUsed >= 7,
    },
    {
      id: "obsessed",
      icon: "🤯",
      name: "Terobsesi Angka",
      description: "Menyelesaikan 500 kalkulasi. Pergi istirahat.",
      unlocked: totalCalculations >= 500,
    },
  ];
}
