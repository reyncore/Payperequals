"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { formatCurrency, CALCULATION_COST, SCIENTIFIC_CALCULATION_COST } from "@/lib/utils";

type CalcMode = "basic" | "scientific";
type ModalState = "idle" | "paying" | "insufficient" | "success";

const BASIC_BUTTONS = [
  ["AC", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const SCIENTIFIC_BUTTONS = [
  ["AC", "(", ")", "÷"],
  ["sin", "cos", "tan", "×"],
  ["log", "ln", "√", "−"],
  ["x²", "xʸ", "π", "+"],
  ["7", "8", "9", "e"],
  ["4", "5", "6", "."],
  ["1", "2", "3", "0"],
  ["+/-", "%", "="],
];

export default function CalculatorPage() {
  const { data: session } = useSession();
  const [mode, setMode] = useState<CalcMode>("basic");
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [waitingOperand, setWaitingOperand] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>("idle");
  const [lastResult, setLastResult] = useState<{ result: string; message: string; isFree: boolean } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [freeAvailable, setFreeAvailable] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [userRes, freeRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/daily-status"),
        ]);
        if (userRes.ok) {
          const d = await userRes.json();
          setBalance(d.data?.balance ?? 0);
        }
        if (freeRes.ok) {
          const d = await freeRes.json();
          setFreeAvailable(d.data?.freeAvailable ?? false);
        }
      } catch {}
    }
    if (session) init();
  }, [session]);

  const currentCost = mode === "scientific" ? SCIENTIFIC_CALCULATION_COST : CALCULATION_COST;

  // ── Input helpers ──────────────────────────────────────────────────────────
  const handleNumber = useCallback((value: string) => {
    if (value === "." && display.includes(".")) return;
    if (waitingOperand) {
      setDisplay(value === "." ? "0." : value);
      setWaitingOperand(false);
    } else {
      setDisplay(display === "0" ? value : display + value);
    }
  }, [display, waitingOperand]);

  const handleOperator = useCallback((op: string) => {
    const opMap: Record<string, string> = { "÷": "/", "×": "*", "−": "-", "+": "+" };
    const mathOp = opMap[op] || op;
    setExpression(prev => {
      if (prev === "" || waitingOperand) return display + " " + mathOp + " ";
      return prev + display + " " + mathOp + " ";
    });
    setWaitingOperand(true);
  }, [display, waitingOperand]);

  const handleScientific = useCallback((fn: string) => {
    const fnMap: Record<string, string> = {
      "sin": "sin(",
      "cos": "cos(",
      "tan": "tan(",
      "log": "log(",
      "ln": "log(",
      "√": "sqrt(",
      "x²": "^2",
      "xʸ": "^",
      "π": "pi",
      "e": "e",
    };
    const mapped = fnMap[fn] ?? fn;
    if (mapped.endsWith("(")) {
      setExpression(prev => prev + (waitingOperand ? "" : display) + mapped);
      setDisplay("0");
      setWaitingOperand(false);
    } else if (mapped === "^2") {
      setExpression(prev => prev + display + "^2 ");
      setWaitingOperand(true);
    } else if (mapped === "^") {
      setExpression(prev => prev + display + "^");
      setWaitingOperand(true);
    } else {
      setDisplay(mapped);
      setWaitingOperand(true);
    }
  }, [display, waitingOperand]);

  const buildExpression = useCallback((): string => {
    if (waitingOperand) return expression.trim().replace(/[+\-*/^]$/, "").trim();
    return (expression + display).trim();
  }, [expression, display, waitingOperand]);

  const handleEquals = useCallback(async () => {
    if (loading) return;
    const fullExpression = buildExpression();
    if (!fullExpression || fullExpression === "0") {
      toast("Masukkan ekspresi dulu ya! 😅");
      return;
    }
    if (!freeAvailable && balance !== null && balance < currentCost) {
      setModal("insufficient");
      setShakeKey(k => k + 1);
      return;
    }
    setModal("paying");
    setLoading(true);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression: fullExpression, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) { setModal("insufficient"); }
        else { toast.error(data.error || "Kalkulasi gagal"); setModal("idle"); }
        setLoading(false);
        return;
      }
      const { result, funMessage, balance: newBalance, isFree } = data.data;
      setBalance(newBalance);
      if (isFree) setFreeAvailable(false);
      setDisplay(result);
      setExpression("");
      setWaitingOperand(true);
      setLastResult({ result, message: funMessage, isFree });
      setModal("success");
      setTimeout(() => setModal("idle"), 3500);
    } catch {
      toast.error("Koneksi gagal, coba lagi");
      setModal("idle");
    }
    setLoading(false);
  }, [loading, balance, freeAvailable, currentCost, buildExpression, mode]);

  function handleFunction(fn: string) {
    if (fn === "AC") { setDisplay("0"); setExpression(""); setWaitingOperand(false); return; }
    if (fn === "+/-") { setDisplay(d => d.startsWith("-") ? d.slice(1) : "-" + d); return; }
    if (fn === "%") { setDisplay(d => String(parseFloat(d) / 100)); return; }
    if (fn === "(") { setExpression(prev => prev + "("); return; }
    if (fn === ")") { setExpression(prev => prev + display + ")"); setWaitingOperand(true); return; }
  }

  function handleButton(btn: string) {
    if (["÷", "×", "−", "+"].includes(btn)) return handleOperator(btn);
    if (["AC", "+/-", "%", "(", ")"].includes(btn)) return handleFunction(btn);
    if (btn === "=") return handleEquals();
    if (["sin","cos","tan","log","ln","√","x²","xʸ","π","e"].includes(btn)) return handleScientific(btn);
    handleNumber(btn);
  }

  function getButtonClass(btn: string) {
    if (btn === "=") return "calc-btn-equals";
    if (["÷", "×", "−", "+"].includes(btn)) return "calc-btn-operator";
    if (["AC", "+/-", "%", "(", ")"].includes(btn)) return "calc-btn-function";
    if (["sin","cos","tan","log","ln","√","x²","xʸ","π","e"].includes(btn)) {
      return "calc-btn relative flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 select-none cursor-pointer active:scale-95 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20";
    }
    return "calc-btn-number";
  }

  const buttons = mode === "basic" ? BASIC_BUTTONS : SCIENTIFIC_BUTTONS;

  return (
    <div className="flex flex-col items-center gap-5 animate-fade-in">
      <div className="text-center">
        <h1 className="page-title">Kalkulator Premium</h1>
        <p className="page-subtitle mt-1">Tekan = dan bayar. Tidak ada cara lain.</p>
      </div>

      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Balance */}
        <div className="flex items-center gap-2 glass rounded-full px-4 py-1.5">
          <span className="text-brand-text-muted text-sm">Saldo:</span>
          <span className={`font-mono font-bold text-sm ${balance !== null && balance < 500 ? "text-brand-accent" : "text-brand-cyan"}`}>
            {balance !== null ? formatCurrency(balance) : "..."}
          </span>
        </div>
        {/* Free daily */}
        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border ${freeAvailable ? "bg-green-500/10 border-green-500/30 text-green-400" : "glass border-white/10 text-brand-text-muted line-through"}`}>
          🎁 1 Gratis Hari Ini {freeAvailable ? "— TERSEDIA!" : "— Sudah Dipakai"}
        </div>
        {/* Mode & Cost */}
        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border ${mode === "scientific" ? "bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan" : "glass border-white/10 text-brand-text-muted"}`}>
          {freeAvailable ? "🎁 Gratis!" : `💸 ${formatCurrency(currentCost)}/kalkulasi`}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-2xl glass">
        {(["basic", "scientific"] as CalcMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setDisplay("0"); setExpression(""); setWaitingOperand(false); }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${mode === m ? "bg-brand-accent text-white" : "text-brand-text-muted hover:text-white"}`}
          >
            {m === "basic" ? "🧮 Basic" : "🔬 Scientific"}
            {m === "scientific" && <span className="ml-1 text-xs opacity-70">(Rp200)</span>}
          </button>
        ))}
      </div>

      {/* Calculator body */}
      <div key={shakeKey} className={`w-full ${mode === "scientific" ? "max-w-sm" : "max-w-xs"} card-gradient-border p-5 ${shakeKey > 0 ? "animate-shake" : ""}`}>
        {/* Display */}
        <div className="rounded-2xl bg-black/40 p-4 mb-4 min-h-[90px] flex flex-col justify-end items-end">
          <div className="text-brand-text-muted font-mono text-sm min-h-[18px] truncate w-full text-right opacity-60">
            {expression || " "}
          </div>
          <div className={`font-mono font-bold transition-all duration-300 w-full text-right truncate ${modal === "success" ? (lastResult?.isFree ? "text-green-400 text-3xl" : "text-brand-cyan text-glow-cyan text-3xl") : modal === "insufficient" ? "text-brand-accent text-3xl" : "text-white text-3xl"}`}
               style={{ fontSize: display.length > 12 ? "1.25rem" : undefined }}>
            {display}
          </div>
        </div>

        {/* Payment banner */}
        {modal !== "idle" && (
          <div className={`mb-4 rounded-xl p-3 text-center text-xs font-medium transition-all ${modal === "paying" ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" : modal === "success" ? (lastResult?.isFree ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20") : "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"}`}>
            {modal === "paying" && <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>Memproses{mode === "scientific" ? " (scientific)" : ""}...</span>}
            {modal === "success" && lastResult?.message}
            {modal === "insufficient" && "Saldo tidak cukup! Top up sekarang. 💸"}
          </div>
        )}

        {/* Button grid */}
        <div className="space-y-2">
          {buttons.map((row, ri) => (
            <div key={ri} className={`grid gap-2 ${mode === "basic" ? (ri === 4 ? "grid-cols-3" : "grid-cols-4") : "grid-cols-4"}`}>
              {row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleButton(btn)}
                  disabled={loading}
                  className={`${getButtonClass(btn)} ${mode === "scientific" ? "h-11 text-sm" : "h-16 text-xl"} disabled:opacity-50`}
                >
                  {btn === "=" && loading
                    ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round"/></svg>
                    : btn}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Cost note */}
        <div className="mt-4 text-center text-xs text-brand-text-muted">
          {freeAvailable ? (
            <span className="text-green-400 font-medium">🎁 Kalkulasi pertama hari ini GRATIS!</span>
          ) : mode === "scientific" ? (
            <span>Mode Scientific — <span className="text-brand-cyan font-medium">Rp200</span> per kalkulasi 🔬</span>
          ) : (
            <span>Basic mode — <span className="text-brand-accent font-medium">Rp100</span> per kalkulasi 💸</span>
          )}
        </div>
      </div>

      {/* Insufficient modal */}
      {modal === "insufficient" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card-gradient-border p-8 max-w-sm w-full text-center animate-slide-up">
            <div className="text-5xl mb-4">💸</div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Saldo Tidak Cukup</h2>
            <p className="text-brand-text-muted text-sm mb-6">
              {mode === "scientific"
                ? "Mode Scientific butuh Rp200. Kalkulator ini tidak murah untuk alasan yang baik."
                : "Minimal Rp100 diperlukan. Angka-angka ini tidak gratis (kecuali yang satu tadi)."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setModal("idle")} className="flex-1 py-3 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all">
                Nanti aja
              </button>
              <a href="/topup" className="flex-1 py-3 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent-hover transition-all text-center">
                Top Up Sekarang
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
