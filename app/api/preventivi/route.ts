import { GetAllPrevRequest, GetAllPerson } from "@/data/preventivi";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const requestOfPrev = await GetAllPrevRequest();
    const person = await GetAllPerson();

    return NextResponse.json({requestOfPrev, person}, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(null, { status: 200 });
  }
}