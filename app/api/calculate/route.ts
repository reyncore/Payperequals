import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeEvaluate } from "@/lib/evaluator";
import {
  getRandomFunMessage,
  getRandomFreeMessage,
  CALCULATION_COST,
  SCIENTIFIC_CALCULATION_COST,
  isSameDay,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const calculateSchema = z.object({
  expression: z.string().min(1).max(200),
  mode: z.enum(["basic", "scientific"]).default("basic"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = calculateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { expression, mode } = parsed.data;
    const baseCost = mode === "scientific" ? SCIENTIFIC_CALCULATION_COST : CALCULATION_COST;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, balance: true, lastFreeCalcDate: true },
      });

      if (!user) throw new Error("USER_NOT_FOUND");

      // Check daily free calculation
      const now = new Date();
      const hasFreeToday =
        user.lastFreeCalcDate && isSameDay(new Date(user.lastFreeCalcDate), now);

      const isFree = !hasFreeToday;
      const cost = isFree ? 0 : baseCost;

      // If not free, check balance
      if (!isFree && user.balance < baseCost) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      // Evaluate on server
      const evaluation = safeEvaluate(expression);
      if (!evaluation.success || evaluation.result === undefined) {
        throw new Error(`EVAL_ERROR:${evaluation.error}`);
      }

      // Deduct balance if not free
      let newBalance = user.balance;
      if (!isFree) {
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: { balance: { decrement: cost } },
          select: { balance: true },
        });
        newBalance = updatedUser.balance;
      }

      // Mark free calc used for today
      if (isFree) {
        await tx.user.update({
          where: { id: user.id },
          data: { lastFreeCalcDate: now },
        });
      }

      // Transaction record
      if (!isFree) {
        await tx.transaction.create({
          data: {
            userId: user.id,
            amount: -cost,
            type: "DEDUCTION",
            note: `Kalkulasi ${mode === "scientific" ? "scientific " : ""}(${expression})`,
          },
        });
      } else {
        await tx.transaction.create({
          data: {
            userId: user.id,
            amount: 0,
            type: "FREE",
            note: `Kalkulasi gratis harian: ${expression}`,
          },
        });
      }

      // Save calculation
      const calculation = await tx.calculation.create({
        data: {
          userId: user.id,
          expression,
          result: evaluation.result,
          cost,
          mode,
          isFree,
        },
      });

      return {
        result: evaluation.result,
        balance: newBalance,
        calculationId: calculation.id,
        isFree,
        cost,
      };
    });

    const funMessage = result.isFree
      ? getRandomFreeMessage()
      : getRandomFunMessage(mode === "scientific");

    return NextResponse.json({
      success: true,
      data: {
        result: result.result,
        expression,
        cost: result.cost,
        balance: result.balance,
        isFree: result.isFree,
        funMessage,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "USER_NOT_FOUND") {
      return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });
    }
    if (message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        { success: false, error: "Saldo tidak cukup. Silakan top up.", code: "INSUFFICIENT_BALANCE" },
        { status: 402 }
      );
    }
    if (message.startsWith("EVAL_ERROR:")) {
      return NextResponse.json(
        { success: false, error: message.replace("EVAL_ERROR:", "") },
        { status: 422 }
      );
    }
    console.error("[CALCULATE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
