import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeAchievements } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [user, totalCalculations, totalSpentAgg, totalTopups, scientificCount, freeCount] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { createdAt: true },
        }),
        prisma.calculation.count({ where: { userId } }),
        prisma.transaction.aggregate({
          where: { userId, type: "DEDUCTION" },
          _sum: { amount: true },
        }),
        prisma.transaction.count({ where: { userId, type: "TOPUP" } }),
        prisma.calculation.count({ where: { userId, mode: "scientific" } }),
        prisma.calculation.count({ where: { userId, isFree: true } }),
      ]);

    const totalSpent = Math.abs(totalSpentAgg._sum.amount ?? 0);

    const achievements = computeAchievements({
      totalCalculations,
      totalSpent,
      totalTopups,
      scientificCalculations: scientificCount,
      freeCalculationsUsed: freeCount,
      joinedAt: user?.createdAt.toISOString() ?? new Date().toISOString(),
    });

    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    return NextResponse.json({
      success: true,
      data: { achievements, unlockedCount, total: achievements.length },
    });
  } catch (error) {
    console.error("[ACHIEVEMENTS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
