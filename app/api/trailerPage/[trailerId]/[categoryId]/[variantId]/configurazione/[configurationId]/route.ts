import { GetAllImages } from "@/data/images";
import {
  GetAllCategoryDescByTrailerId,
  GetAllColorByVariantId,
  GetAllConfigurationWithConfigurationChangeByConfigurationId,
  GetAllNodeByVariantId,
  GetAllSelectorByVariantId,
  GetAllVariantDescByCategoryId,
  GetCategoryById,
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
      configurationId: string;
    };
  }
) {
  const { trailerId, categoryId, variantId, configurationId } = params;

  try {
    const trailer = await GetTrailerById(trailerId);
    const category = await GetCategoryById(categoryId);
    const variant = await GetVariantyById(variantId);
    const configuration = await await db.configuration.findUnique({
      where: { id: configurationId },
      include: { values: true, configurationVisibilityCondition: true }, // Include anche i valori associati se necessario
    });
    const allNode = await GetAllNodeByVariantId(variantId);
    const editConfigurations = await GetConfigurationByVariantId(variantId);
    const allConfigurationWithConfigurationChange =
      await GetAllConfigurationWithConfigurationChangeByConfigurationId(
        configurationId
      );

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

    if (!configuration) {
      return NextResponse.json(
        { message: "Configurazione not found" },
        { status: 404 }
      );
    }

    if (configuration.variantId !== variantId) {
      return NextResponse.json(
        { message: "Configurazione not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        trailer,
        category,
        variant,
        configuration,
        allNode,
        editConfigurations,
        allConfigurationWithConfigurationChange,
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
