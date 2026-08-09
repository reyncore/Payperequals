"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  totalCalculations: number;
  totalSpent: number;
  isCurrentUser: boolean;
}

const RANK_ICONS = ["🥇", "🥈", "🥉"];
const RANK_TITLES = [
  "Pemborос Terbesar",
  "Pemborос Besar",
  "Pemborос Menengah",
  "Pemborос Biasa",
  "Pemborос Pemula",
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<{ rank: number; totalCalculations: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.data.leaderboard);
          setMyRank(data.data.myRank);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <p className="page-subtitle mt-1">
          Top 10 Pemborос Matematis Sepanjang Masa
        </p>
      </div>

      {/* Hero podium */}
      {!loading && leaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-3 mb-8">
          {/* 2nd */}
          <PodiumCard entry={leaderboard[1]} height="h-24" />
          {/* 1st */}
          <PodiumCard entry={leaderboard[0]} height="h-32" featured />
          {/* 3rd */}
          <PodiumCard entry={leaderboard[2]} height="h-20" />
        </div>
      )}

      {/* Full list */}
      <div className="card-gradient-border overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display font-semibold text-white">Semua Pemborос</h2>
          <span className="text-brand-text-muted text-sm">Diperbarui real-time</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">🏜️</div>
            <p className="text-white font-medium">Leaderboard kosong</p>
            <p className="text-brand-text-muted text-sm mt-1">Jadilah yang pertama menghitung!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                  entry.isCurrentUser
                    ? "bg-brand-accent/5 border-l-2 border-brand-accent"
                    : "hover:bg-white/3"
                }`}
              >
                {/* Rank */}
                <div className="w-10 text-center">
                  {entry.rank <= 3
                    ? <span className="text-2xl">{RANK_ICONS[entry.rank - 1]}</span>
                    : <span className="font-mono font-bold text-brand-text-muted text-lg">#{entry.rank}</span>}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  entry.rank === 1
                    ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"
                    : entry.isCurrentUser
                    ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/30"
                    : "bg-white/10 text-white"
                }`}>
                  {entry.name[0].toUpperCase()}
                </div>

                {/* Name & title */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${entry.isCurrentUser ? "text-brand-accent" : "text-white"}`}>
                    {entry.name}
                  </p>
                  <p className="text-brand-text-muted text-xs">
                    {RANK_TITLES[Math.min(entry.rank - 1, RANK_TITLES.length - 1)]}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-white text-sm">
                    {entry.totalCalculations.toLocaleString("id-ID")} kalkulasi
                  </p>
                  <p className="text-brand-accent text-xs">
                    {formatCurrency(entry.totalSpent)} dihabiskan
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My rank (if outside top 10) */}
      {!loading && myRank && (
        <div className="mt-4 card-gradient-border p-4 border-brand-accent/20 flex items-center gap-4">
          <span className="text-brand-text-muted text-sm">Peringkat kamu:</span>
          <span className="font-display font-bold text-white text-xl">#{myRank.rank}</span>
          <span className="text-brand-text-muted text-sm">dengan {myRank.totalCalculations} kalkulasi</span>
          <Link href="/calculator" className="ml-auto text-brand-accent text-sm hover:underline">
            Hitung lebih banyak →
          </Link>
        </div>
      )}

      {/* Fun note */}
      <div className="mt-6 p-4 rounded-2xl glass border border-brand-gold/20 text-center">
        <p className="text-brand-gold text-sm">
          💡 Semua nama disamarkan untuk menjaga privasi para pemborос.
        </p>
      </div>
    </div>
  );
}

function PodiumCard({
  entry,
  height,
  featured = false,
}: {
  entry: LeaderboardEntry;
  height: string;
  featured?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
        featured
          ? "bg-brand-gold/20 text-brand-gold border-2 border-brand-gold/50"
          : "bg-white/10 text-white border border-white/20"
      }`}>
        {entry.name[0].toUpperCase()}
      </div>
      <p className={`text-xs font-medium text-center truncate w-full ${entry.isCurrentUser ? "text-brand-accent" : "text-white"}`}>
        {entry.name.split(" ")[0]}
      </p>
      <p className="text-brand-text-muted text-xs">{entry.totalCalculations}×</p>
      <div className={`w-full rounded-t-xl flex items-end justify-center pb-2 ${height} ${
        featured
          ? "bg-gradient-to-b from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30"
          : "bg-white/5 border border-white/10"
      }`}>
        <span className="text-2xl">{RANK_ICONS[entry.rank - 1]}</span>
      </div>
    </div>
  );
}
