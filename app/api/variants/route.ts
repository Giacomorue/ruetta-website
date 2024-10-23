import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Recupera tutte le varianti insieme alle categorie e ai rimorchi (trailer)
    const variants = await db.variant.findMany({
      include: {
        category: {
          include: {
            trailer: true, // Include informazioni sul rimorchio collegato alla categoria
          },
        },
      },
    });

    // Ritorna le varianti con categorie e trailer in formato JSON
    return NextResponse.json({ variants }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(null, { status: 500 }); // In caso di errore ritorna uno status 500
  }
}
