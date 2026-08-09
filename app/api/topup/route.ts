import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TOPUP_AMOUNTS } from "@/lib/utils";

export const dynamic = "force-dynamic";


const topupSchema = z.object({
  amount: z.number().refine(
    (v) => TOPUP_AMOUNTS.includes(v),
    { message: "Nominal top up tidak valid" }
  ),
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
    const parsed = topupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { amount } = parsed.data;

    // Mock payment processing delay simulation
    // In production: integrate real Stripe payment confirmation here

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: session.user.id },
        data: { balance: { increment: amount } },
        select: { balance: true },
      });

      await tx.transaction.create({
        data: {
          userId: session.user.id,
          amount,
          type: "TOPUP",
          note: `Top up Rp${amount.toLocaleString("id-ID")}`,
        },
      });

      return user;
    });

    return NextResponse.json({
      success: true,
      data: {
        balance: updatedUser.balance,
        amount,
        message: "Top up berhasil! Selamat menghitung hal-hal mahal.",
      },
    });
  } catch (error) {
    console.error("[TOPUP_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Top up gagal, coba lagi" },
      { status: 500 }
    );
  }
}
