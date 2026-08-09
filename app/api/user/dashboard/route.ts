import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const [user, totalSpentAgg, totalCalculations, recentTransactions, recentCalculations] =
      await Promise.all([
        // Current balance
        prisma.user.findUnique({
          where: { id: userId },
          select: { balance: true },
        }),
        // Total amount spent on calculations
        prisma.transaction.aggregate({
          where: {
            userId,
            type: "DEDUCTION",
          },
          _sum: { amount: true },
        }),
        // Total calculation count
        prisma.calculation.count({ where: { userId } }),
        // Recent transactions (last 5)
        prisma.transaction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        // Recent calculations (last 5)
        prisma.calculation.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    const totalSpent = Math.abs(totalSpentAgg._sum.amount ?? 0);

    return NextResponse.json({
      success: true,
      data: {
        balance: user?.balance ?? 0,
        totalSpent,
        totalCalculations,
        recentTransactions,
        recentCalculations,
      },
    });
  } catch (error) {
    console.error("[DASHBOARD_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
