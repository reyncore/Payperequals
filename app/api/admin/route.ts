import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Admin-only route
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Admin only." },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalTransactions,
      totalCalculations,
      revenueAgg,
      users,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.calculation.count(),
      // Revenue = sum of all TOPUP transactions
      prisma.transaction.aggregate({
        where: { type: "TOPUP" },
        _sum: { amount: true },
      }),
      // All users with counts
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          balance: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              transactions: true,
              calculations: true,
            },
          },
        },
        take: 100,
      }),
    ]);

    const totalRevenue = revenueAgg._sum.amount ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalTransactions,
        totalRevenue,
        totalCalculations,
        users: users.map((u) => ({
          ...u,
          updatedAt: undefined, // strip sensitive fields
        })),
      },
    });
  } catch (error) {
    console.error("[ADMIN_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
