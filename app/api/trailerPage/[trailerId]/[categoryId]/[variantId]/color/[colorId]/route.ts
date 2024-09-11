import { GetAllImages } from "@/data/images";
import {
  GetAllCategoryDescByTrailerId,
  GetAllColorByVariantId,
  GetAllConfigurationWithConfigurationChangeByConfigurationId,
  GetAllNodeByVariantId,
  GetAllSelectorByVariantId,
  GetAllVariantDescByCategoryId,
  GetCategoryById,
  GetColorById,
  GetConfigurationById,
  GetConfigurationByVariantId,
  GetNodesByVariantId,
  GetNumberOfVariantVisibleInCategoryById,
  GetTrailerById,
  GetVariantDataByAccessibleUUID,
  GetVariantyById,
} from "@/data/trailer";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      trailerId: string;
      categoryId: string;
      variantId: string;
      colorId: string;
    };
  }
) {
  const { trailerId, categoryId, variantId, colorId } = params;

  try {
    const trailer = await GetTrailerById(trailerId);
    const category = await GetCategoryById(categoryId);
    const variant = await GetVariantyById(variantId);
    const color = await GetColorById(colorId);
    const images = await GetAllImages();

    if (!trailer || !category || !variant) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (category.trailerId !== trailerId) {
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 404 }
      );
    }

    if (variant.categoryId !== categoryId) {
      return NextResponse.json({ message: "Invalid variant" }, { status: 404 });
    }

    if (!variant) {
      return NextResponse.json(
        { message: "Trailer not found" },
        { status: 404 }
      );
    }

    if(!color){
        return NextResponse.json({ message: "Color not found" }, { status: 404 });
    }

    if(color.variantId!== variantId){
        return NextResponse.json({ message: "Invalid color" }, { status: 404 });
    }

    return NextResponse.json(
      {
        trailer,
        category,
        variant,
        color,
        images,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching variant data:", error);
    return NextResponse.json(
      { message: "Error fetching variant data" },
      { status: 500 }
    );
  }
}
