import { GetAllImages } from "@/data/images";
import { GetAllCategoryDescByTrailerId, GetTrailerById, GetVariantDataByAccessibleUUID } from "@/data/trailer";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { trailerId: string } }) {
    const { trailerId } = params;
    try {
      const category = await GetAllCategoryDescByTrailerId(trailerId);
  
      return NextResponse.json({category}, { status: 200 });
    } catch (error) {
      console.error('Error fetching variant data:', error);
      return NextResponse.json({ message: 'Error fetching variant data' }, { status: 500 });
    }
  }
  