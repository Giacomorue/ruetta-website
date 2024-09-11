import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const trailers = await db.trailer.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(trailers, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(null, { status: 200 });
  }
}
