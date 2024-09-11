import { GetAllImages } from "@/data/images";
import { GetVariantDataByAccessibleUUID } from "@/data/trailer";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const images = await GetAllImages();

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('Error fetching variant data:', error);
    return NextResponse.json({ message: 'Error fetching images data' }, { status: 500 });
  }
}
