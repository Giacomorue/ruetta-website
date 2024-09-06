"use server";

import { db } from "@/lib/prisma";

export const GetTrailerById = async (id: string) => {
  try {
    return await db.trailer.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetAllTrailerDesc = async () => {
  try {
    const trailers = await db.trailer.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return trailers;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const GetAllTrailerDescIncludeCategories = async () => {
  try {
    const trailers = await db.trailer.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        categories: true,
      },
    });

    return trailers;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const GetCategoryById = async (id: string) => {
  try {
    return await db.category.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetAllCategoryDescByTrailerId = async (trailerId: string) => {
  try {
    const category = await db.category.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        trailerId,
      },
    });

    return category;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const GetNumberOfVariantVisibleInCategoryById = async (
  categoryId: string
) => {
  try {
    const variant = await db.variant.findMany({
      where: {
        categoryId,
        visible: true,
      },
    });

    return variant.length;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const GetAllVariantDescByCategoryId = async (categoryId: string) => {
  try {
    const variant = await db.variant.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        categoryId,
      },
    });

    return variant;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const GetVariantyById = async (id: string) => {
  try {
    return await db.variant.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetConfigurationById = async (id: string) => {
  try {
    const configuration = await db.configuration.findUnique({
      where: { id },
      include: { values: true }, // Include anche i valori associati se necessario
    });

    return configuration;
  } catch (err) {
    return null;
  }
};

export const GetConfigurationByVariantId = async (variantId: string) => {
  try {
    const configurations = await db.configuration.findMany({
      where: { variantId },
      include: { values: true }, // Include anche i valori associati se necessario
      orderBy: { order: "asc" },
    });

    return configurations;
  } catch (err) {
    return null;
  }
};

export const GetConfigurationValueById = async (id: string) => {
  try {
    const configurationValue = await db.configurationValue.findUnique({
      where: { id },
    });

    return configurationValue;
  } catch (err) {
    return null;
  }
};

export const GetAllSelectorByVariantId = async (variantId: string) => {
  try {
    const selector = await db.selector.findMany({
      where: { variantId },
      include: { options: true },
      orderBy: {
        order: "asc",
      },
    });

    return selector;
  } catch (err) {
    return null;
  }
};

export const GetAllSelectorValueBySelectorId = async (selectorId: string) => {
  try {
    const selector = await db.selectorOption.findMany({
      where: { selectorId },
      orderBy: {
        order: "asc",
      },
    });

    return selector;
  } catch (err) {
    return null;
  }
};

export const GetSelectorById = async (id: string) => {
  try {
    const selector = await db.selector.findUnique({
      where: { id },
      include: {
        options: { orderBy: { order: "asc" } },
      },
    });

    return selector;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const GetAllValueBySelectorId = async (selectorId: string) => {
  try {
    return await db.selectorOption.findMany({
      where: { selectorId },
    });
  } catch (err) {
    return null;
  }
};

export const GetSelectorOptionById = async (id: string) => {
  try {
    return await db.selectorOption.findUnique({
      where: { id },
    });
  } catch (err) {
    return null;
  }
};

export const GetVisibilityConditionById = async (id: string) => {
  try {
    return await db.selectorVisibilityCondition.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetConfigurationVisibilityCondition = async (id: string) => {
  try {
    return await db.configurationVisibilityCondition.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetSelectorOptionChangeById = async (id: string) => {
  try {
    return await db.selectorOptionChange.findUnique({
      where: {
        id,
      },
      include: {
        change: true,
        elseChange: true,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetAllSelectorOptionWithSelectorOptionChangeBySelectroId = async (
  selectorId: string
) => {
  try {
    return await db.selectorOption.findMany({
      where: {
        selectorId,
      },
      include: {
        selectorOptionChange: {
          include: {
            change: true,
            elseChange: true,
          },
        },
      },
    });
  } catch (err) {
    return [];
  }
};

export const GetNodesByVariantId = async (variantId: string) => {
  try {
    const nodes = await db.node.findMany({
      where: { variantId },
    });

    return nodes;
  } catch (err) {
    console.error("Errore nel recupero dei nodi:", err);
    return null;
  }
};

export const GetAllConfigurationWithConfigurationChangeByConfigurationId =
  async (configurationId: string) => {
    try {
      return await db.configurationValue.findMany({
        where: {
          configurationId,
        },
        include: {
          configurationChange: {
            include: {
              change: true,
              elseChange: true,
            },
          },
        },
      });
    } catch (err) {
      return [];
    }
  };

export const GetAllNodeByVariantId = async (variantId: string) => {
  try {
    const nodes = await db.node.findMany({
      where: { variantId },
    });
    return nodes;
  } catch (err) {
    console.error("Errore nel recupero dei nodi:", err);
    return null;
  }
};

export const GetConfigurationChangeById = async (id: string) => {
  try {
    return await db.configurationChange.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetColorById = async (id: string) => {
  try {
    return await db.colors.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    return null;
  }
};

export const GetAllColorByVariantId = async (variantId: string) => {
  try {
    return await db.colors.findMany({
      where: {
        variantId,
      },
      orderBy: {
        order: "asc",
      },
    });
  } catch (err) {
    return [];
  }
};

export const GetVariantDataByAccessibleUUID = async (
  accessibleUUID: string
) => {
  try {
    const variant = await db.variant.findUnique({
      where: {
        accessibleUUID,
      },
      include: {
        colors: {
          orderBy: { order: "asc" },
        },
        nodes: {
          include: {
            configurationChangeAction: true,
          },
        },
        configurations: {
          orderBy: { order: "asc" },
          include: {
            values: {
              include: {
                configurationChange: {
                  include: {
                    change: true,
                    elseChange: true,
                  },
                },
              },
            },
            configurationVisibilityCondition: true,
          },
        },
        selectors: {
          orderBy: { order: "asc" },
          include: {
            options: {
              orderBy: { order: "asc" },
              include: {
                selectorOptionChange: {
                  include: {
                    change: true,
                    elseChange: true,
                  },
                },
              },
            },
            selectorVisibilityCondition: true,
          },
        },
      },
    });

    return variant;
  } catch (err) {
    return null;
  }
};
