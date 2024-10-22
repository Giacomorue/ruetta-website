import { GetAllImages } from "@/data/images";
import {
  GetAllCategoryDescByTrailerId,
  GetAllConfigurationWithConfigurationChangeByConfigurationId,
  GetAllNodeByVariantId,
  GetAllSelectorByVariantId,
  GetAllSelectorOptionWithSelectorOptionChangeBySelectroId,
  GetAllSelectorValueBySelectorId,
  GetAllVariantDescByCategoryId,
  GetCategoryById,
  GetConfigurationById,
  GetConfigurationByVariantId,
  GetNodesByVariantId,
  GetNumberOfVariantVisibleInCategoryById,
  GetSelectorById,
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
      selectorId: string;
    };
  }
) {
  const { trailerId, categoryId, variantId, selectorId } = params;

  try {
    const trailer = await GetTrailerById(trailerId);
    const category = await GetCategoryById(categoryId);
    const variant = await GetVariantyById(variantId);
    const selector = await db.selector.findUnique({
      where: { id: selectorId },
      include: {
        options: { orderBy: { order: "asc" } },
        selectorVisibilityCondition: true,
      },
    });

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

    if (!selector) {
      return NextResponse.json(
        { message: "Selector not found" },
        { status: 404 }
      );
    }

    const configuration = await GetConfigurationById(
      selector.configurationToRefer
    );
    const selectorOption = await GetAllSelectorValueBySelectorId(selectorId);
    const images = await GetAllImages();
    const editConfigurations = await GetConfigurationByVariantId(variantId);
    const allSelectorOptionWithChange = await GetAllSelectorOptionWithSelectorOptionChangeBySelectroId(selector.id);

    return NextResponse.json(
      {
        trailer,
        category,
        variant,
        selector,
        configuration,
        selectorOption,
        images,
        editConfigurations,
        allSelectorOptionWithChange
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
