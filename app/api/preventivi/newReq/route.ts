import { GetAllPrevRequest, GetAllPerson } from "@/data/preventivi";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const trailer = await db.trailer.findMany({
      where: {
        visible: true,
      },
      include: {
        categories: {
          where: {
            visible: true,
          },
          include: {
            variants: {
              where: {
                visible: true,
                configurable: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({trailer}, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(null, { status: 200 });
  }
}