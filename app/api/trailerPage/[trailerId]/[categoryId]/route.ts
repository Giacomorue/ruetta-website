import { GetAllImages } from "@/data/images";
import { GetAllCategoryDescByTrailerId, GetAllVariantDescByCategoryId, GetCategoryById, GetNumberOfVariantVisibleInCategoryById, GetTrailerById, GetVariantDataByAccessibleUUID } from "@/data/trailer";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { trailerId: string; categoryId: string } }) {
  const { trailerId, categoryId } = params;

  try {
    const trailer = await GetTrailerById(trailerId);
    const category = await GetCategoryById(categoryId);
    const allVariant = await GetAllVariantDescByCategoryId(categoryId);
    const numberOfActiveVariantion = await GetNumberOfVariantVisibleInCategoryById(categoryId);
    const images = await GetAllImages();

    if (!trailer) {
      return NextResponse.json({ message: 'Trailer not found' }, { status: 404 });
    }

    return NextResponse.json({trailer, category, allVariant, numberOfActiveVariantion, images}, { status: 200 });
  } catch (error) {
    console.error('Error fetching variant data:', error);
    return NextResponse.json({ message: 'Error fetching variant data' }, { status: 500 });
  }
}