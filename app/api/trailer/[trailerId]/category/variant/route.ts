import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { trailerId: string } }
) {
  const { trailerId } = params;

  try {
    const variants = await db.variant.findMany({
      where: {
        category: {
          trailerId: trailerId,
        },
      },
      include: {
        category: true, // Include informazioni sulla categoria se necessario
      },
    });

    return NextResponse.json({ variants }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(null, { status: 200 });
  }
}
