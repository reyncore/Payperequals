import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSameDay } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastFreeCalcDate: true },
    });

    const hasFreeToday = user?.lastFreeCalcDate
      ? isSameDay(new Date(user.lastFreeCalcDate), new Date())
      : false;

    // Milliseconds until midnight reset
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilReset = midnight.getTime() - now.getTime();

    return NextResponse.json({
      success: true,
      data: {
        hasFreeToday,
        freeAvailable: !hasFreeToday,
        msUntilReset,
        lastUsed: user?.lastFreeCalcDate ?? null,
      },
    });
  } catch (error) {
    console.error("[DAILY_STATUS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
