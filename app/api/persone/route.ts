import { GetAllPerson } from "@/data/preventivi";
import { GetVariantDataByAccessibleUUID } from "@/data/trailer";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
) {
  try {
    const person = await GetAllPerson();

    return NextResponse.json({ person }, { status: 200 });
  } catch (error) {
    console.error("Error fetching variant data:", error);
    return NextResponse.json(
      { message: "Error fetching variant data" },
      { status: 500 }
    );
  }
}
