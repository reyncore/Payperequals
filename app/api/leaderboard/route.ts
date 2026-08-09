import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Top 10 by total calculations
    const topByCalculations = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { calculations: true } },
        calculations: {
          select: { cost: true },
        },
      },
      orderBy: {
        calculations: { _count: "desc" },
      },
      take: 10,
    });

    const leaderboard = topByCalculations.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      // Anonymize: show only first name + last initial
      name:
        user.id === session.user.id
          ? user.name + " (Kamu)"
          : anonymizeName(user.name),
      totalCalculations: user._count.calculations,
      totalSpent: user.calculations.reduce((sum, c) => sum + c.cost, 0),
      isCurrentUser: user.id === session.user.id,
    }));

    // Current user rank (if not in top 10)
    const currentUserRank = leaderboard.find((l) => l.isCurrentUser);
    let myRank = null;

    if (!currentUserRank) {
      const myCount = await prisma.calculation.count({
        where: { userId: session.user.id },
      });
      const aboveMe = await prisma.user.count({
        where: {
          calculations: { some: {} },
        },
      });
      // Approximate rank
      myRank = { rank: aboveMe + 1, totalCalculations: myCount };
    }

    return NextResponse.json({
      success: true,
      data: { leaderboard, myRank },
    });
  } catch (error) {
    console.error("[LEADERBOARD_ERROR]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

function anonymizeName(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].slice(0, 3) + "***";
  }
  return parts[0] + " " + parts[1][0] + ".";
}
