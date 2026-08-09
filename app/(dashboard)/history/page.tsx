import { Suspense } from "react";
import HistoryContent from "./HistoryContent";

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-fade-in space-y-4">
          <div className="h-8 w-48 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-4 w-64 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-12 w-52 rounded-2xl bg-white/5 animate-pulse mt-6" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
