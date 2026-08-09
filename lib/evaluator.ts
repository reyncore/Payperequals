/**
 * Safe math expression evaluator using mathjs
 * All computation happens server-side — never in the browser.
 */
import { evaluate, round } from "mathjs";

const FORBIDDEN_PATTERNS = [
  /import/i,
  /require/i,
  /process/i,
  /eval/i,
  /function/i,
  /=>/i,
  /\bwindow\b/i,
  /\bdocument\b/i,
  /\bfetch\b/i,
  /\bhttp/i,
  /\bfs\b/i,
  /\bchild_process\b/i,
  /`/,
  /\$/,
];

const MAX_EXPRESSION_LENGTH = 200;

export interface EvaluationResult {
  success: boolean;
  result?: string;
  error?: string;
}

export function safeEvaluate(expression: string): EvaluationResult {
  // Trim whitespace
  const cleaned = expression.trim();

  // Validate length
  if (cleaned.length === 0) {
    return { success: false, error: "Ekspresi tidak boleh kosong" };
  }

  if (cleaned.length > MAX_EXPRESSION_LENGTH) {
    return {
      success: false,
      error: `Ekspresi terlalu panjang (maksimal ${MAX_EXPRESSION_LENGTH} karakter)`,
    };
  }

  // Security check: block forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(cleaned)) {
      return {
        success: false,
        error: "Ekspresi mengandung karakter tidak diizinkan",
      };
    }
  }

  try {
    const rawResult = evaluate(cleaned);

    // Handle different result types
    let result: string;

    if (typeof rawResult === "number") {
      if (!isFinite(rawResult)) {
        return { success: false, error: "Hasil tidak terhingga (division by zero?)" };
      }
      // Round to max 10 decimal places
      result = String(round(rawResult, 10));
    } else if (typeof rawResult === "boolean") {
      result = String(rawResult);
    } else if (rawResult && typeof rawResult === "object" && "toString" in rawResult) {
      result = rawResult.toString();
      // Limit result length
      if (result.length > 50) {
        result = result.substring(0, 50) + "...";
      }
    } else {
      result = String(rawResult);
    }

    return { success: true, result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ekspresi tidak valid";
    return {
      success: false,
      error: `Kesalahan evaluasi: ${message}`,
    };
  }
}
