"use server";

import {
  GetAllSelectorByVariantId,
  GetAllValueBySelectorId,
  GetCategoryById,
  GetConfigurationById,
  GetConfigurationByVariantId,
  GetConfigurationChangeById,
  GetConfigurationValueById,
  GetConfigurationVisibilityCondition,
  GetSelectorById,
  GetSelectorOptionById,
  GetSelectorOptionChangeById,
  GetTrailerById,
  GetVariantByIdWithAllData,
  GetVariantyById,
  GetVisibilityConditionById,
} from "@/data/trailer";
import { db } from "@/lib/prisma";
import { pusher } from "@/lib/pusherServer";
import {
  AddConfigurationValueSchema,
  AddConfigurationValueType,
  AddNewConfigurationChangeSchema,
  AddNewConfigurationChangeType,
  AddNewConfigurationVisibilityConditionSchema,
  AddNewConfigurationVisibilityConditionType,
  AddNewSelectorOptionChangeSchema,
  AddNewSelectorOptionChangeType,
  AddNewVisibilityConditionSchema,
  AddNewVisibilityConditionType,
  AddSelectorOptionSchema,
  AddSelectorOptionType,
  CreateNewConfigurationSchema,
  CreateNewConfigurationType,
  CreateNewSelectorSchema,
  CreateNewSelectorType,
  CreateNewSottocategoriaSchema,
  CreateNewSottocategoriaType,
  CreateNewTrailerSchema,
  CreateNewTrailerType,
  CreateNewVariantSchema,
  CreateNewVariantType,
  CreateNodeSchema,
  CreateNodeType,
  EditConfigurationChangeSchema,
  EditConfigurationChangeType,
  EditConfigurationSchema,
  EditConfigurationType,
  EditConfigurationValueSchema,
  EditConfigurationValueType,
  EditConfigurationVisibilityConditionSchema,
  EditConfigurationVisibilityConditionType,
  EditNewSelectorOptionChangeSchema,
  EditNewSelectorOptionChangeType,
  EditSelectorOptionSchema,
  EditSelectorOptionType,
  EditSelectorSchema,
  EditSelectorType,
  EditVisibilityConditionSchema,
  EditVisibilityConditionType,
} from "@/schemas/schema-trailer";
import { revalidatePath } from "next/cache";
import {
  SelectorOption,
  Selector,
  Configuration,
  Category,
  CheckType,
  CheckTypeChange,
  ConfigurationValue,
  ConfigurationVisibilityCondition,
  Image,
  Node,
  Position,
  Scale,
  SelectorOptionChange,
  SelectorOptionChangeAction,
  SelectorVisibilityCondition,
  Trailer,
  Variant,
  ConfigurationChange,
  ConfigurationChangeAction,
  Prisma,
} from "prisma/prisma-client";

export async function CreateTrailer(
  data: CreateNewTrailerType,
  socketId: string
) {
  const validForm = CreateNewTrailerSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  const { name, fornitore } = validForm.data;

  try {
    const trailer = await db.trailer.create({
      data: {
        name,
        fornitore,
      },
    });

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    revalidatePath("/admin/rimorchi");

    return { trailer };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella creazione" };
  }
}

export async function DelteTrailer(id: string, socketId: string) {
  const trailer = await GetTrailerById(id);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  try {
    await db.trailer.delete({
      where: {
        id,
      },
    });

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    revalidatePath("/admin/rimorchi");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function UpdateTrailer(
  data: CreateNewTrailerType,
  id: string,
  socketId: string
) {
  const trailer = await GetTrailerById(id);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  const formValid = CreateNewTrailerSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const { name, fornitore, description, images, visible } = formValid.data;

  try {
    await db.trailer.update({
      where: {
        id,
      },
      data: {
        name,
        fornitore,
        description,
        images,
        visible,
      },
    });

    revalidatePath("/admin/rimorchi/" + id);
    revalidatePath("/admin/rimorchi/");

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nell'aggiornamento" };
  }
}

export async function CreateCategory(
  data: CreateNewSottocategoriaType,
  trailerId: string,
  socketId: string
) {
  const trailer = await GetTrailerById(trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  const formValid = CreateNewSottocategoriaSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const { name } = formValid.data;

  try {
    const category = await db.category.create({
      data: {
        name,
        trailerId,
      },
    });

    revalidatePath("/admin/rimorchi/" + trailerId);

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { category };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella creazione" };
  }
}

export async function DeleteCategory(id: string, socketId: string) {
  const category = await GetCategoryById(id);

  if (!category) {
    return { error: "Categoria non trovato" };
  }

  try {
    await db.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/rimorchi/" + category.trailerId);

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function UpdateCategory(
  data: CreateNewSottocategoriaType,
  id: string,
  socketId: string
) {
  const category = await GetCategoryById(id);

  if (!category) {
    return { error: "Sottocategoria non trovato" };
  }

  const formValid = CreateNewSottocategoriaSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const { name, description, visible, images } = formValid.data;

  try {
    await db.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        visible,
        images,
      },
    });

    revalidatePath("/admin/rimorchi/" + category.trailerId + "/" + category.id);
    revalidatePath("/admin/rimorchi/" + category.trailerId);

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nell'aggiornamento" };
  }
}

export async function CreateVariant(
  data: CreateNewVariantType,
  categoryId: string,
  socketId: string
) {
  const category = await GetCategoryById(categoryId);

  if (!category) {
    return { error: "Rimorchio non trovato" };
  }

  const formValid = CreateNewVariantSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const { name, prezzo } = formValid.data;

  try {
    const variant = await db.variant.create({
      data: {
        name,
        prezzo,
        categoryId,
        initialCameraPosition: {
          x: -20,
          y: 10,
          z: 40,
        },
      },
    });

    revalidatePath("/admin/rimorchi/" + category.trailerId + "/" + categoryId);

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { variant };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella creazione" };
  }
}

export async function DeleteVariant(id: string, socketId: string) {
  const variant = await GetVariantyById(id);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  try {
    await db.variant.delete({
      where: {
        id,
      },
    });

    revalidatePath(
      "/admin/rimorchi/" + category?.trailerId + "/" + category?.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function UpdateVariant(
  data: CreateNewVariantType,
  id: string,
  socketId: string
) {
  const variant = await GetVariantyById(id);

  if (!variant) {
    return { error: "Variante non trovato" };
  }

  const formValid = CreateNewVariantSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non valida" };
  }

  const {
    name,
    prezzo,
    description,
    visible,
    configurable,
    has3DModel,
    images,
    descriptionPrev,
    cameraInitialPositionX,
    cameraInitialPositionY,
    cameraInitialPositionZ,
    nomePrev,
    fileUrl,
  } = formValid.data;

  try {
    await db.variant.update({
      where: {
        id,
      },
      data: {
        name,
        prezzo,
        description,
        descriptionPrev,
        images,
        visible,
        configurable,
        has3DModel,
        nomePrev,
        initialCameraPosition: {
          x: cameraInitialPositionX,
          y: cameraInitialPositionY,
          z: cameraInitialPositionZ,
        },
        fileUrl,
      },
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );
    revalidatePath("/admin/rimorchi/" + category.trailerId + "/" + category.id);

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nell'aggiornamento" };
  }
}

export async function CreateConfiguration(
  data: CreateNewConfigurationType,
  variantId: string,
  socketId: string
) {
  const variant = await GetVariantyById(variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const formValid = CreateNewConfigurationSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const { name, values } = formValid.data;

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    const lastOrder = await db.configuration.findFirst({
      where: { variantId: variantId }, // Sostituisci 'yourVariantId' con l'ID della variante desiderata
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastOrder ? lastOrder.order + 1 : 0;

    const configuration = await db.configuration.create({
      data: {
        name,
        variantId,
        order: newOrder,
        defaultValuePreventivo: "",
        scount: 20,
        values: {
          create: values.map((value) => ({
            value,
            textBig: "",
            textLittle: "",
          })),
        },
      },
      include: {
        values: true, // Include the values in the response
      },
    });

    // Step 2: Update the configuration with the ID of the first value
    const defaultValueId = configuration.values[0].id;

    await db.configuration.update({
      where: {
        id: configuration.id,
      },
      data: {
        defaultValue: defaultValueId,
        defaultValuePreventivo: defaultValueId,
      },
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { configuration };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella creazione" };
  }
}

export async function UpdateConfiguration(
  data: EditConfigurationType,
  id: string,
  socketId: string
) {
  const configuration = await GetConfigurationById(id);

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const formValid = EditConfigurationSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const { name, defaultValue, defaultValuePreventivo, scount } = formValid.data;

  try {
    await db.configuration.update({
      where: {
        id,
      },
      data: {
        name,
        defaultValue,
        defaultValuePreventivo,
        scount,
      },
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );
    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id +
        "/configurazione/" +
        id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nell'aggiornamento" };
  }
}

export async function DeleteConfiguration(id: string, socketId: string) {
  const configuration = await GetConfigurationById(id);

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const selectors = await db.selector.findMany({
    where: {
      variantId: variant.id,
      configurationToRefer: id,
    },
  });
  let errorMessage = "";

  if (selectors && selectors.length > 0) {
    const allSelectorName =
      selectors.map((selector) => selector.name).join(", ") + ".";
    console.log(allSelectorName);
    errorMessage += "<br />Associata a questi selettori: " + allSelectorName;
  }

  const visibleCondition = await db.selectorVisibilityCondition.findMany({
    where: {
      configurationId: id,
    },
  });

  if (visibleCondition && visibleCondition.length > 0) {
    const allVisibilitySelectors = await Promise.all(
      visibleCondition.map(async (condition) => {
        const selector = await db.selector.findUnique({
          where: { id: condition.selectorId },
          select: { name: true },
        });
        return selector?.name || null; // Restituisci null se il nome non esiste
      })
    );

    const allVisibilitySelectorsNames =
      allVisibilitySelectors
        .filter((name) => name !== null) // Filtra eventuali nomi nulli
        .join(", ") + ".";

    if (allVisibilitySelectorsNames.trim() !== ".") {
      errorMessage +=
        "<br />Usata nelle condizioni di visibilità dei seguenti selettori: " +
        allVisibilitySelectorsNames;
    }
  }

  // Nuova parte: Controllo delle condizioni di visibilità delle configurazioni
  const configVisibilityConditions =
    await db.configurationVisibilityCondition.findMany({
      where: {
        configurationId: id,
      },
    });

  if (configVisibilityConditions && configVisibilityConditions.length > 0) {
    const allVisibilityConfigurations = await Promise.all(
      configVisibilityConditions.map(async (condition) => {
        const configuration = await db.configuration.findUnique({
          where: { id: condition.parentConfigurationId || "" },
          select: { name: true },
        });
        return configuration?.name || null; // Restituisci null se il nome non esiste
      })
    );

    const allVisibilityConfigurationsNames =
      allVisibilityConfigurations
        .filter((name) => name !== null) // Filtra eventuali nomi nulli
        .join(", ") + ".";

    if (allVisibilityConfigurationsNames.trim() !== ".") {
      errorMessage +=
        "<br />Usata nelle condizioni di visibilità delle seguenti configurazioni: " +
        allVisibilityConfigurationsNames;
    }
  }

  // Nuova parte: Controllo se la configurazione è usata come condizione in un cambiamento di valore del selettore
  const selectorOptionChanges = await db.selectorOptionChange.findMany({
    where: {
      OR: [
        { configurationId: id }, // Usata come condizione in un ramo if
        {
          change: {
            some: {
              configurationToChangeId: id, // Usata come cambiamento in un ramo if
            },
          },
        },
        {
          elseChange: {
            some: {
              configurationToChangeId: id, // Usata come cambiamento in un ramo else
            },
          },
        },
      ],
    },
    include: {
      selectorOption: true, // Includi il selettore associato
    },
  });

  if (selectorOptionChanges && selectorOptionChanges.length > 0) {
    const allSelectorsWithCondition = await Promise.all(
      selectorOptionChanges.map(async (change) => {
        const selector = await db.selector.findUnique({
          where: { id: change.selectorOption.selectorId }, // Usa il campo selectorOptionId
          select: { name: true },
        });
        return selector?.name || null; // Restituisci null se il nome non esiste
      })
    );

    const allSelectorsWithConditionNames =
      allSelectorsWithCondition
        .filter((name) => name !== null) // Filtra eventuali nomi nulli
        .join(", ") + ".";

    if (allSelectorsWithConditionNames.trim() !== ".") {
      errorMessage +=
        "<br />Usata come condizione o cambiamento nei seguenti selettori: " +
        allSelectorsWithConditionNames;
    }
  }

  // Nuova parte: Controllo se la configurazione è usata in cambiamenti di altre configurazioni
  const configurationChanges = await db.configurationChange.findMany({
    where: {
      configurationId: id, // Usata come condizione in un cambiamento di configurazione
    },
    include: {
      configurationValue: {
        include: {
          configuration: true, // Includi la configurazione associata
        },
      },
    },
  });

  if (configurationChanges && configurationChanges.length > 0) {
    const allConfigurationsWithChange = await Promise.all(
      configurationChanges.map(async (change) => {
        const configuration = change.configurationValue.configuration;
        return configuration?.name || null; // Restituisci null se il nome non esiste
      })
    );

    const allConfigurationsWithChangeNames =
      allConfigurationsWithChange
        .filter((name) => name !== null) // Filtra eventuali nomi nulli
        .join(", ") + ".";

    if (allConfigurationsWithChangeNames.trim() !== ".") {
      errorMessage +=
        "<br />Usata come condizione nei seguenti cambiamenti di configurazioni: " +
        allConfigurationsWithChangeNames;
    }
  }

  // Verifica se esiste un messaggio di errore e ritorna l'oggetto di errore
  if (errorMessage !== "") {
    return { youCant: true, message: errorMessage };
  }

  try {
    await db.configuration.delete({
      where: {
        id,
      },
    });

    const allConfiguration = await GetConfigurationByVariantId(variant.id);

    if (!allConfiguration || allConfiguration.length <= 0) {
      await db.variant.update({
        where: {
          id: variant.id,
        },
        data: {
          configurable: false,
        },
      });
    }

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function DuplicateConfiguration(
  configurationId: string,
  socketId: string
) {
  const originalConfig = await GetConfigurationById(configurationId);

  if (!originalConfig) {
    return { error: "Configurazione non trovata" };
  }

  let newName = `${originalConfig.name} - Copia`;

  let count = 1;

  // Check if the name already exists and increment the count if necessary
  while (await db.configuration.findFirst({ where: { name: newName } })) {
    count++;
    newName = `${originalConfig.name} - Copia ${count}`;
  }

  const variant = await GetVariantyById(originalConfig.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    const lastOrder = await db.configuration.findFirst({
      where: { variantId: variant.id }, // Sostituisci 'yourVariantId' con l'ID della variante desiderata
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastOrder ? lastOrder.order + 1 : 1;
    // Create the duplicated configuration
    const newConfig = await db.configuration.create({
      data: {
        name: newName,
        variantId: originalConfig.variantId,
        order: newOrder,
        defaultValuePreventivo: "",
        scount: originalConfig.scount,
      },
    });

    if (originalConfig.visibilityConditionId) {
      const newVisibilityConditionId = await duplicateVisibilityCondition(
        originalConfig.visibilityConditionId,
        newConfig.id,
        true
      );

      await db.configuration.update({
        where: { id: newConfig.id },
        data: { visibilityConditionId: newVisibilityConditionId },
      });
    }

    for (const originalValue of originalConfig.values) {
      const isDefault = originalValue.id === originalConfig.defaultValue;
      const isDefaultPreventivo =
        originalValue.id === originalConfig.defaultValuePreventivo;

      await duplicateConfigurationValue(
        originalValue.id,
        newConfig.id,
        isDefault,
        isDefaultPreventivo
      );
    }

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { newConfig };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella duplicazione della configurazione" };
  }
}

async function duplicateVisibilityCondition(
  visibilityConditionId: string,
  newConfigurationId: string,
  isFirstNode: boolean,
  parentId: string | null = null
): Promise<string> {
  const originalCondition = await GetConfigurationVisibilityCondition(
    visibilityConditionId
  );

  if (!originalCondition) {
    throw new Error("Condizione di visibilità non trovata");
  }

  // Crea la nuova condizione di visibilità duplicata
  const newCondition = await db.configurationVisibilityCondition.create({
    data: {
      configurationId: originalCondition.configurationId,
      checkType: originalCondition.checkType,
      expectedValue: originalCondition.expectedValue,
      ifVisible: originalCondition.ifVisible,
      elseVisible: originalCondition.elseVisible,
      parentId: parentId,
      isFirstNode: isFirstNode,
      parentConfigurationId: newConfigurationId,
    },
  });

  // Duplica ricorsivamente i rami "if" e "else"
  if (originalCondition.ifRecId) {
    const newIfRecId = await duplicateVisibilityCondition(
      originalCondition.ifRecId,
      newConfigurationId,
      false,
      newCondition.id
    );
    await db.configurationVisibilityCondition.update({
      where: { id: newCondition.id },
      data: { ifRecId: newIfRecId },
    });
  }

  if (originalCondition.elseRecId) {
    const newElseRecId = await duplicateVisibilityCondition(
      originalCondition.elseRecId,
      newConfigurationId,
      false,
      newCondition.id
    );
    await db.configurationVisibilityCondition.update({
      where: { id: newCondition.id },
      data: { elseRecId: newElseRecId },
    });
  }

  return newCondition.id;
}

async function duplicateConfigurationValue(
  configurationValueId: string,
  newConfigurationId: string,
  isDefault: boolean,
  isDefaultPreventivo: boolean
): Promise<void> {
  // Recupera il valore della configurazione originale con tutte le relazioni necessarie
  const configurationValue = await db.configurationValue.findUnique({
    where: { id: configurationValueId },
    include: {
      configurationChange: true, // Includi le relazioni di change
    },
  });

  if (!configurationValue) {
    throw new Error("Valore della configurazione non trovato");
  }

  // Creare il nuovo valore della configurazione duplicato
  const newConfigurationValue = await db.configurationValue.create({
    data: {
      value: configurationValue.value,
      isFree: configurationValue.isFree,
      prezzo: configurationValue.prezzo,
      hasText: configurationValue.hasText,
      textBig: configurationValue.textBig,
      textLittle: configurationValue.textLittle,
      configurationId: newConfigurationId,
    },
  });

  if (isDefault) {
    await db.configuration.update({
      where: { id: newConfigurationId },
      data: { defaultValue: newConfigurationValue.id },
    });
  }

  if (isDefaultPreventivo) {
    await db.configuration.update({
      where: { id: newConfigurationId },
      data: { defaultValuePreventivo: newConfigurationValue.id },
    });
  }

  //Duplicare tutti i cambiamenti del valore della configurazione
  for (const firstNodeId of configurationValue.configurationChangeFirstNode) {
    await DuplicateConfigurationChange(
      firstNodeId,
      newConfigurationValue.id,
      newConfigurationValue.id,
      true,
      false,
      false,
      false
    );
  }

  for (const firstNodeId of configurationValue.configurationElseChangeFirstNode) {
    await DuplicateConfigurationChange(
      firstNodeId,
      newConfigurationValue.id,
      newConfigurationValue.id,
      true,
      false,
      false,
      true
    );
  }
}

async function DuplicateConfigurationChange(
  originalChangeId: string,
  newConfigurationValueId: string,
  parentId: string,
  isFirstNode: boolean = false,
  isIfRec: boolean = false,
  isElseRec: boolean = false,
  isElse: boolean
): Promise<string> {
  // Recupera il cambiamento di configurazione originale
  const originalChange = await db.configurationChange.findUnique({
    where: { id: originalChangeId },
    include: {
      change: true, // Includi la relazione 'change'
      elseChange: true, // Includi la relazione 'elseChange'
    },
  });

  if (!originalChange) {
    throw new Error("Cambiamento di configurazione non trovato");
  }

  // Duplica il cambiamento di configurazione originale
  const newChange = await db.configurationChange.create({
    data: {
      haveIf: originalChange.haveIf,
      configurationId: originalChange.configurationId,
      checkType: originalChange.checkType,
      expectedValue: originalChange.expectedValue,
      parentId: parentId,
      isFirstNode: isFirstNode,
      configurationValueId: newConfigurationValueId,
    },
  });

  if (isFirstNode) {
    if (isElse) {
      await db.configurationValue.update({
        where: { id: parentId },
        data: {
          configurationElseChangeFirstNode: {
            push: newChange.id,
          },
        },
      });
    } else {
      await db.configurationValue.update({
        where: { id: parentId },
        data: {
          configurationChangeFirstNode: {
            push: newChange.id,
          },
        },
      });
    }
  }

  if (isIfRec) {
    await db.configurationChange.update({
      where: {
        id: parentId,
      },
      data: {
        ifRecId: {
          push: newChange.id,
        },
      },
    });
  } else if (isElseRec) {
    await db.configurationChange.update({
      where: {
        id: parentId,
      },
      data: {
        elseRecId: {
          push: newChange.id,
        },
      },
    });
  }

  // Duplica le azioni di cambiamento associate
  if (originalChange.change.length > 0) {
    for (const changeAction of originalChange.change) {
      await db.configurationChangeAction.create({
        data: {
          nodeId: changeAction.nodeId,
          visible: changeAction.visible,
          changePosition: changeAction.changePosition,
          changeScale: changeAction.changeScale,
          position: changeAction.position || undefined,
          scale: changeAction.scale || undefined,
          configurationChangeId: newChange.id,
        },
      });
    }
  }

  // Duplica le azioni di elseChange associate
  if (originalChange.haveIf && originalChange.elseChange) {
    if (originalChange.elseChange.length > 0) {
      for (const elseAction of originalChange.elseChange) {
        await db.configurationChangeAction.create({
          data: {
            nodeId: elseAction.nodeId,
            visible: elseAction.visible,
            changePosition: elseAction.changePosition,
            changeScale: elseAction.changeScale,
            position: elseAction.position || undefined,
            scale: elseAction.scale || undefined,
            configurationElseChangeId: newChange.id,
          },
        });
      }
    }
  }

  // Duplica ricorsivamente tutti i rami 'ifRecId'
  if (originalChange.ifRecId && originalChange.ifRecId.length > 0) {
    for (const ifRecId of originalChange.ifRecId) {
      await DuplicateConfigurationChange(
        ifRecId,
        newConfigurationValueId,
        newChange.id,
        false,
        true,
        false,
        false
      );
    }
  }

  // Duplica ricorsivamente tutti i rami 'elseRecId'
  if (originalChange.elseRecId && originalChange.elseRecId.length > 0) {
    for (const elseRecId of originalChange.elseRecId) {
      await DuplicateConfigurationChange(
        elseRecId,
        newConfigurationValueId,
        newChange.id,
        false,
        false,
        true,
        false
      );
    }
  }

  return newChange.id;
}

export async function ReorderConfigurations(
  data: Configuration[],
  variantId: string,
  socketId: string
) {
  // Trova la variante usando l'ID
  const variant = await GetVariantyById(variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const trailer = await GetTrailerById(category.trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  try {
    // Esegui una transazione per aggiornare l'ordine di ciascuna configurazione
    const batchSize = 50; // Puoi modificare la dimensione del batch a seconda dei tuoi requisiti

    // Suddividi i dati in batch
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Esegui una transazione per ogni batch
    for (const batch of batches) {
      await db.$transaction(
        batch.map((config, index) =>
          db.configuration.update({
            where: { id: config.id },
            data: { order: index }, // Aggiorna il campo "order" in base all'indice
          })
        )
      );
    }

    // Revalidate the path related to the updated page
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.error("Errore nel riordinamento delle configurazioni:", err);
    return { error: "Errore nel riordinamento delle configurazioni" };
  }
}

export async function AddValuesToConfiguration(
  data: AddConfigurationValueType,
  configurationId: string,
  socketId: string
) {
  const configuration = await GetConfigurationById(configurationId);

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const formValid = AddConfigurationValueSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const { values } = formValid.data;

  try {
    await db.configurationValue.createMany({
      data: values.map((value) => ({
        value,
        configurationId,
        textBig: "",
        textLittle: "",
      })),
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );
    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id +
        "/configurazione/" +
        configurationId
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nell'aggiornamento" };
  }
}

export async function DeleteConfigurationValue(id: string, socketId: string) {
  const value = await GetConfigurationValueById(id);

  if (!value) {
    return { error: "Valore non trovato" };
  }

  const configuration = await GetConfigurationById(value.configurationId);

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  if (configuration.defaultValue === id) {
    return {
      error: "Non puoi cancellare la configurazione di default, cambiala prima",
    };
  }

  if (configuration.defaultValuePreventivo === id) {
    return {
      error:
        "Non puoi cancellare la configurazione di default per il preventivo, cambiala prima",
    };
  }

  let errorMessage = "";

  // Controlla se il valore è utilizzato in `selectorOption`
  const selectorOption = await db.selectorOption.findMany({
    where: {
      valueOfConfigurationToRefer: id,
    },
  });

  if (selectorOption.length > 0) {
    const selectorIds = selectorOption.map((s) => s.selectorId);

    const allSelectors = await db.selector.findMany({
      where: {
        id: {
          in: selectorIds,
        },
      },
    });

    const allSelectorName =
      allSelectors.map((selector) => selector.name).join(", ") + ".";
    console.log(allSelectorName);

    errorMessage += "<br />Associata a questi selettori: " + allSelectorName;
  }

  // Controlla se il valore è utilizzato in `selectorVisibilityCondition`
  const visibleCondition = await db.selectorVisibilityCondition.findMany({
    where: {
      expectedValue: id, // Assumi che `id` sia l'ID del valore che stai cercando di cancellare
    },
  });

  if (visibleCondition.length > 0) {
    const allVisibilitySelectors = await Promise.all(
      visibleCondition.map(async (condition) => {
        const selector = await db.selector.findUnique({
          where: { id: condition.selectorId },
          select: { name: true },
        });
        return selector?.name;
      })
    );

    const allVisibilitySelectorsNames =
      allVisibilitySelectors
        .filter((name) => name) // Filtra eventuali nomi nulli o undefined
        .join(", ") + ".";

    console.log(allVisibilitySelectorsNames);

    errorMessage +=
      "<br />Usata nelle condizioni di visibilità dei seguenti selettori: " +
      allVisibilitySelectorsNames;
  }

  // Nuova parte: Controlla se il valore è utilizzato in `configurationVisibilityCondition`
  const configVisibilityConditions =
    await db.configurationVisibilityCondition.findMany({
      where: {
        expectedValue: id, // Assumi che `id` sia l'ID del valore che stai cercando di cancellare
      },
    });

  if (configVisibilityConditions.length > 0) {
    const allVisibilityConfigurations = await Promise.all(
      configVisibilityConditions.map(async (condition) => {
        const configuration = await db.configuration.findUnique({
          where: { id: condition.configurationId },
          select: { name: true },
        });
        return configuration?.name;
      })
    );

    const allVisibilityConfigurationsNames =
      allVisibilityConfigurations
        .filter((name) => name) // Filtra eventuali nomi nulli o undefined
        .join(", ") + ".";

    console.log(allVisibilityConfigurationsNames);

    errorMessage +=
      "<br />Usata nelle condizioni di visibilità delle seguenti configurazioni: " +
      allVisibilityConfigurationsNames;
  }

  // Nuova parte: Controllo se il valore di configurazione è usato come condizione in un cambiamento di valore del selettore
  const selectorOptionChanges = await db.selectorOptionChange.findMany({
    where: {
      OR: [
        { expectedValue: id }, // Usato come valore atteso in un ramo if
        {
          change: {
            some: {
              newValueValue: id, // Usato come nuovo valore in un ramo if
            },
          },
        },
        {
          elseChange: {
            some: {
              newValueValue: id, // Usato come nuovo valore in un ramo else
            },
          },
        },
      ],
    },
    include: {
      selectorOption: true, // Includi il selettore associato
    },
  });

  if (selectorOptionChanges && selectorOptionChanges.length > 0) {
    const allSelectorsWithCondition = await Promise.all(
      selectorOptionChanges.map(async (change) => {
        const selector = await db.selector.findUnique({
          where: { id: change.selectorOption.selectorId }, // Usa il campo selectorOptionId
          select: { name: true },
        });
        return selector?.name || null; // Restituisci null se il nome non esiste
      })
    );

    const allSelectorsWithConditionNames =
      allSelectorsWithCondition
        .filter((name) => name !== null) // Filtra eventuali nomi nulli
        .join(", ") + ".";

    if (allSelectorsWithConditionNames.trim() !== ".") {
      errorMessage +=
        "<br />Usato come condizione o cambiamento nei seguenti selettori: " +
        allSelectorsWithConditionNames;
    }
  }

  const configurationChanges = await db.configurationChange.findMany({
    where: {
      expectedValue: id,
    },
    include: {
      configurationValue: {
        include: {
          configuration: true, // Includi la configurazione associata
        },
      },
    },
  });

  if (configurationChanges.length > 0) {
    const allConfigurationsWithChange = await Promise.all(
      configurationChanges.map(async (change) => {
        const configuration = change.configurationValue.configuration;
        return configuration?.name || null; // Restituisci null se il nome non esiste
      })
    );

    const allConfigurationsWithChangeNames =
      allConfigurationsWithChange
        .filter((name) => name !== null) // Filtra eventuali nomi nulli
        .join(", ") + ".";

    if (allConfigurationsWithChangeNames.trim() !== ".") {
      errorMessage +=
        "<br />Usato come condizione nei seguenti cambiamenti di configurazioni: " +
        allConfigurationsWithChangeNames;
    }
  }

  if (errorMessage !== "") {
    return { youCant: true, message: errorMessage };
  }

  try {
    await db.configurationValue.delete({
      where: { id },
    });

    // Rivalida i percorsi per la configurazione e il rimorchio
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}`
    );
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/configurazione/${configuration.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella cancellazione del valore" };
  }
}

export async function UpdateConfigurationValue(
  data: EditConfigurationValueType,
  id: string,
  socketId: string
) {
  const oldValue = await GetConfigurationValueById(id);

  if (!oldValue) {
    return { error: "Valore non trovato" };
  }

  const configuration = await GetConfigurationById(oldValue.configurationId);

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const formValue = EditConfigurationValueSchema.safeParse(data);

  if (!formValue.success) {
    return { error: "Form non valido" };
  }

  const { value, isFree, prezzo, hasText, textBig, textLittle } =
    formValue.data;

  if (!isFree && (prezzo == 0 || prezzo == null || prezzo == undefined)) {
    return {
      error:
        "Definisci prima un prezzo valido, oppure imposta il valore come gratis",
    };
  }

  try {
    await db.configurationValue.update({
      where: { id },
      data: {
        value,
        isFree,
        prezzo,
        hasText,
        textBig: textBig ?? "",
        textLittle: textLittle ?? "",
      },
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );
    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id +
        "/configurazione/" +
        configuration.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nell'aggiornamento del valore" };
  }
}

export async function CreateSelector(
  data: CreateNewSelectorType,
  variantId: string,
  socketId: string
) {
  const variant = await GetVariantyById(variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const formValid = CreateNewSelectorSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const { name, values, configurationToRefer } = formValid.data;

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    const lastOrderObj = await db.selector.findFirst({
      where: { variantId },
      orderBy: { order: "desc" },
    });

    let lastOrder = lastOrderObj ? lastOrderObj.order + 1 : 0;

    const selector = await db.selector.create({
      data: {
        name,
        configurationToRefer,
        variantId: variantId,
        order: lastOrder,
        options: {
          create: values.map((value, index) => ({
            label: value.label,
            valueOfConfigurationToRefer: value.valueOfConfigurationToRefer,
            order: index + 1,
            modalDescription: `<p>${name} ${value.label}</p>`,
          })),
        },
      },
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { selector };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella creazione del selettore" };
  }
}

export async function DeleteSelector(id: string, socketId: string) {
  const selector = await GetSelectorById(id);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    await db.selector.delete({
      where: {
        id,
      },
    });

    const allSelector = await db.selector.findFirst({
      where: { variantId: variant.id, visible: true },
    });

    if (!allSelector) {
      if (variant.configurable) {
        await db.variant.update({
          where: {
            id: variant.id,
          },
          data: {
            configurable: false,
          },
        });

        revalidatePath(
          "/admin/rimorchi/" + category.trailerId + "/" + category.id
        );
      }
    }

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function ReorderSelectors(
  data: Selector[],
  variantId: string,
  socketId: string
) {
  // Ottieni la variante
  const variant = await GetVariantyById(variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  // Ottieni la categoria
  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    // Esegui un'operazione di transazione per aggiornare l'ordine di tutti i selettori
    await db.$transaction(
      data.map((selector, index) =>
        db.selector.update({
          where: { id: selector.id },
          data: { order: index }, // Assumi che tu abbia un campo "order" per gestire l'ordinamento
        })
      )
    );

    // Revalida il percorso relativo alla pagina aggiornata
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.error("Errore nel riordinamento dei selettori:", err);
    return { error: "Errore nel riordinamento dei selettori" };
  }
}

export async function AddSelectorOption(
  data: AddSelectorOptionType,
  selectorId: string,
  socketId: string
) {
  const selector = await GetSelectorById(selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const formValid = AddSelectorOptionSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const { label, valueOfConfigurationToRefer } = formValid.data;

  try {
    const lastOrder = await db.selectorOption.findFirst({
      where: { selectorId: selectorId },
      orderBy: { order: "desc" },
    });

    if (!lastOrder) {
      return { error: "Impossibile trovare l'ultimo" };
    }

    await db.selectorOption.create({
      data: {
        selectorId,
        label,
        valueOfConfigurationToRefer,
        order: lastOrder?.order + 1,
        modalDescription: `<p>${selector.name} ${label}</p>`,
      },
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id +
        "/selector/" +
        selector.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nell'aggiunta" };
  }
}

export async function DeleteSelectorValue(id: string, socketId: string) {
  const selectorValue = await GetSelectorOptionById(id);

  if (!selectorValue) {
    return { error: "Valore del selettore non trovato" };
  }

  const selector = await GetSelectorById(selectorValue.selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    await db.selectorOption.delete({
      where: { id },
    });

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id +
        "/selector/" +
        selector.id
    );

    const allSelectorVisible = await db.selectorOption.findMany({
      where: {
        selectorId: selector.id,
        visible: true,
      },
    });

    if (allSelectorVisible.length < 2) {
      await db.selector.update({
        where: { id: selector.id },
        data: {
          visible: false,
        },
      });

      revalidatePath(
        "/admin/rimorchi/" +
          category.trailerId +
          "/" +
          category.id +
          "/" +
          variant.id
      );

      const allSelector = await db.selector.findFirst({
        where: { id: variant.id, visible: true },
      });

      if (!allSelector) {
        if (variant.configurable) {
          await db.variant.update({
            where: {
              id: variant.id,
            },
            data: {
              configurable: false,
            },
          });

          revalidatePath(
            "/admin/rimorchi/" +
              category.trailerId +
              "/" +
              category.id +
              "/" +
              variant.id
          );

          revalidatePath(
            "/admin/rimorchi/" + category.trailerId + "/" + category.id
          );
        }
      }
    }

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Errore nella cancellazione" };
  }
}
export async function EditSelectorValue(
  data: EditSelectorOptionType,
  id: string,
  socketId: string
) {
  const selectorValue = await GetSelectorOptionById(id);

  if (!selectorValue) {
    return { error: "Valore del selettore non trovato" };
  }

  const selector = await GetSelectorById(selectorValue.selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const formValid = EditSelectorOptionSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const {
    label,
    visible,
    modalDescription,
    images,
    block,
    colorCodePrincipal,
    colorCodeSecondary,
    hasSecondaryColor,
  } = formValid.data;

  try {
    await db.selectorOption.update({
      where: { id },
      data: {
        label,
        visible,
        images,
        modalDescription,
        block,
        colorCodePrincipal,
        colorCodeSecondary,
        hasSecondaryColor,
      },
    });

    if (visible === false) {
      const allSelectorVisible = await db.selectorOption.findMany({
        where: {
          selectorId: selector.id,
          visible: true,
        },
      });

      if (allSelectorVisible.length < 2) {
        await db.selector.update({
          where: { id: selector.id },
          data: {
            visible: false,
          },
        });

        //TODO: Controllare che quando nascondo il selettore devo anche togliere il configurabile se non ci sono altri selettori

        const allSelector = await db.selector.findFirst({
          where: { id: variant.id, visible: true },
        });

        if (!allSelector) {
          if (variant.configurable) {
            await db.variant.update({
              where: {
                id: variant.id,
              },
              data: {
                configurable: false,
              },
            });

            revalidatePath(
              "/admin/rimorchi/" +
                category.trailerId +
                "/" +
                category.id +
                "/" +
                variant.id
            );

            revalidatePath(
              "/admin/rimorchi/" + category.trailerId + "/" + category.id
            );
          }
        }
      }
    }

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    return { error: "Qualcosa è andato storto nella modifica" };
  }
}

export async function EditSelector(
  data: EditSelectorType,
  id: string,
  socketId: string
) {
  const selector = await GetSelectorById(id);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const formValid = EditSelectorSchema.safeParse(data);

  if (!formValid.success) {
    return { error: "Form non valido" };
  }

  const {
    name,
    description,
    visible,
    isColorSelector,
    moreInfoDescription,
    moreInfoImages,
    moreInfoModal,
  } = formValid.data;

  try {
    await db.selector.update({
      where: { id },
      data: {
        name,
        description,
        visible,
        isColorSelector,
        moreInfoModal,
        moreInfoDescription,
        moreInfoImages,
      },
    });

    if (selector.visible === true && visible === false) {
      const allSelector = await db.selector.findFirst({
        where: { id: variant.id, visible: true },
      });

      if (!allSelector) {
        if (variant.configurable) {
          await db.variant.update({
            where: {
              id: variant.id,
            },
            data: {
              configurable: false,
            },
          });

          revalidatePath(
            "/admin/rimorchi/" + category.trailerId + "/" + category.id
          );
        }
      }
    }

    revalidatePath(
      "/admin/rimorchi/" +
        category.trailerId +
        "/" +
        category.id +
        "/" +
        variant.id
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    return { error: "Errore nella modifica" };
  }
}

export async function ReorderSelectorValue(
  data: SelectorOption[],
  selectorId: string,
  socketId: string
) {
  const selector = await GetSelectorById(selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    await db.$transaction(
      data.map((option, index) =>
        db.selectorOption.update({
          where: { id: option.id },
          data: { order: index }, // Assumi che tu abbia un campo "order" per gestire l'ordinamento
        })
      )
    );

    // Rendi il path relativo alla pagina aggiornata
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    return { error: "Errore nel riordinamento" };
  }
}

export async function CreateANewVisibilityCondition(
  selectorId: string,
  data: AddNewVisibilityConditionType,
  socketId: string
) {
  const selector = await GetSelectorById(selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const validForm = AddNewVisibilityConditionSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  const {
    checkType,
    configurationId,
    expectedValue,
    parentId,
    isFirstNode,
    isElseRec,
    isIfRec,
    elseVisible,
    ifVisible,
  } = validForm.data;

  if (!isFirstNode) {
    const parentCheck = await GetVisibilityConditionById(parentId);

    if (!parentCheck) {
      return { error: "Padre non trovato" };
    }
  }

  try {
    const visibilityCondition = await db.selectorVisibilityCondition.create({
      data: {
        checkType: checkType === "NOTEQUAL" ? "NOTEQUAL" : "EQUAL",
        configurationId,
        expectedValue,
        parentId,
        isFirstNode,
        selectorId: selectorId,
        ifVisible,
        elseVisible,
      },
    });

    if (isFirstNode) {
      await db.selector.update({
        where: {
          id: parentId,
        },
        data: {
          visibilityConditionId: visibilityCondition.id,
        },
      });
    }

    if (isIfRec) {
      await db.selectorVisibilityCondition.update({
        where: {
          id: parentId,
        },
        data: {
          ifRecId: visibilityCondition.id,
        },
      });
    } else if (isElseRec) {
      await db.selectorVisibilityCondition.update({
        where: {
          id: parentId,
        },
        data: {
          elseRecId: visibilityCondition.id,
        },
      });
    }

    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    return { error: "Errore nella creazione" };
  }
}

export async function EditVisibilityCondition(
  visibilityConditionId: string,
  data: EditVisibilityConditionType,
  socketId: string
) {
  const visibilityCondition = await GetVisibilityConditionById(
    visibilityConditionId
  );

  if (!visibilityCondition) {
    return { error: "Condizione di visibilità non trovata" };
  }

  const selector = await GetSelectorById(visibilityCondition.selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const validForm = EditVisibilityConditionSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  const { checkType, configurationId, expectedValue, elseVisible, ifVisible } =
    validForm.data;

  try {
    await db.selectorVisibilityCondition.update({
      where: {
        id: visibilityCondition.id,
      },
      data: {
        checkType: checkType === "NOTEQUAL" ? "NOTEQUAL" : "EQUAL",
        configurationId,
        expectedValue,
        ifVisible,
        elseVisible,
      },
    });

    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    return { error: "Errore nella creazione" };
  }
}

export async function DeleteVisibilityCondition(
  visibilityConditionId: string,
  socketId: string
) {
  // Ottieni la condizione di visibilità corrente
  const visibilityCondition = await GetVisibilityConditionById(
    visibilityConditionId
  );

  if (!visibilityCondition) {
    return { error: "Condizione di visibilità non trovata" };
  }

  const selector = await GetSelectorById(visibilityCondition.selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // Funzione ricorsiva per cancellare tutte le condizioni di visibilità figlie
  async function deleteChildConditions(conditionId: string) {
    const condition = await GetVisibilityConditionById(conditionId);

    if (!condition) return;

    if (condition.ifRecId) {
      await deleteChildConditions(condition.ifRecId);
    }

    if (condition.elseRecId) {
      await deleteChildConditions(condition.elseRecId);
    }

    // Cancella la condizione attuale
    await db.selectorVisibilityCondition.delete({
      where: { id: conditionId },
    });
  }

  try {
    // Cancella le condizioni figlie ricorsivamente
    await deleteChildConditions(visibilityConditionId);

    // Pulizia del collegamento nel nodo padre o nel selettore
    if (visibilityCondition.isFirstNode) {
      // Se è il nodo principale, pulisce il collegamento nel selettore
      await db.selector.update({
        where: { id: visibilityCondition.selectorId },
        data: { visibilityConditionId: null },
      });
    } else {
      // Se non è il nodo principale, pulisce il collegamento nel nodo padre
      const parentCondition = await GetVisibilityConditionById(
        visibilityCondition.parentId!
      );

      if (parentCondition) {
        if (parentCondition.ifRecId === visibilityConditionId) {
          await db.selectorVisibilityCondition.update({
            where: { id: parentCondition.id },
            data: { ifRecId: null },
          });
        } else if (parentCondition.elseRecId === visibilityConditionId) {
          await db.selectorVisibilityCondition.update({
            where: { id: parentCondition.id },
            data: { elseRecId: null },
          });
        }
      }
    }

    // Aggiorna la cache delle pagine dopo la cancellazione
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function CreateANewConfigurationVisibilityCondition(
  configurationId: string,
  data: AddNewConfigurationVisibilityConditionType,
  socketId: string
) {
  const configuration = await GetConfigurationById(configurationId);

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const validForm =
    AddNewConfigurationVisibilityConditionSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  const {
    checkType,
    configurationId: conditionConfigurationId,
    expectedValue,
    parentId,
    isFirstNode,
    isElseRec,
    isIfRec,
    elseVisible,
    ifVisible,
  } = validForm.data;

  if (!isFirstNode) {
    const parentCheck = await GetConfigurationVisibilityCondition(parentId);

    if (!parentCheck) {
      return { error: "Padre non trovato" };
    }
  }

  try {
    const visibilityCondition =
      await db.configurationVisibilityCondition.create({
        data: {
          checkType: checkType === "NOTEQUAL" ? "NOTEQUAL" : "EQUAL",
          configurationId: conditionConfigurationId,
          expectedValue,
          parentId,
          isFirstNode,
          parentConfigurationId: configurationId,
          ifVisible,
          elseVisible,
        },
      });

    if (isFirstNode) {
      await db.configuration.update({
        where: {
          id: parentId,
        },
        data: {
          visibilityConditionId: visibilityCondition.id,
        },
      });
    }

    if (isIfRec) {
      await db.configurationVisibilityCondition.update({
        where: {
          id: parentId,
        },
        data: {
          ifRecId: visibilityCondition.id,
        },
      });
    } else if (isElseRec) {
      await db.configurationVisibilityCondition.update({
        where: {
          id: parentId,
        },
        data: {
          elseRecId: visibilityCondition.id,
        },
      });
    }

    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/configurazione/${configuration.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    return { error: "Errore nella creazione" };
  }
}

export async function EditConfigurationVisibilityCondition(
  visibilityConditionId: string,
  data: EditConfigurationVisibilityConditionType,
  socketId: string
) {
  const visibilityCondition = await GetConfigurationVisibilityCondition(
    visibilityConditionId
  );

  if (!visibilityCondition) {
    return { error: "Condizione di visibilità non trovata" };
  }

  const configuration = await GetConfigurationById(
    visibilityCondition.configurationId
  );

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const validForm = EditConfigurationVisibilityConditionSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  const { checkType, configurationId, expectedValue, elseVisible, ifVisible } =
    validForm.data;

  try {
    await db.configurationVisibilityCondition.update({
      where: {
        id: visibilityCondition.id,
      },
      data: {
        checkType: checkType === "NOTEQUAL" ? "NOTEQUAL" : "EQUAL",
        configurationId,
        expectedValue,
        ifVisible,
        elseVisible,
      },
    });

    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/configuration/${configuration.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    return { error: "Errore nella modifica" };
  }
}

export async function DeleteConfigurationVisibilityCondition(
  visibilityConditionId: string,
  socketId: string
) {
  // Ottieni la condizione di visibilità corrente
  const visibilityCondition = await GetConfigurationVisibilityCondition(
    visibilityConditionId
  );

  if (!visibilityCondition) {
    return { error: "Condizione di visibilità non trovata" };
  }

  const configuration = await GetConfigurationById(
    visibilityCondition.configurationId
  );

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // Funzione ricorsiva per cancellare tutte le condizioni di visibilità figlie
  async function deleteChildConditions(conditionId: string) {
    const condition = await GetConfigurationVisibilityCondition(conditionId);

    if (!condition) return;

    if (condition.ifRecId) {
      await deleteChildConditions(condition.ifRecId);
    }

    if (condition.elseRecId) {
      await deleteChildConditions(condition.elseRecId);
    }

    // Cancella la condizione attuale
    await db.configurationVisibilityCondition.delete({
      where: { id: conditionId },
    });
  }

  try {
    // Cancella le condizioni figlie ricorsivamente
    await deleteChildConditions(visibilityConditionId);

    // Pulizia del collegamento nel nodo padre o nella configurazione
    if (visibilityCondition.isFirstNode) {
      // Se è il nodo principale, pulisce il collegamento nella configurazione
      await db.configuration.update({
        where: { id: visibilityCondition.configurationId },
        data: { visibilityConditionId: null },
      });
    } else {
      // Se non è il nodo principale, pulisce il collegamento nel nodo padre
      const parentCondition = await GetConfigurationVisibilityCondition(
        visibilityCondition.parentId!
      );

      if (parentCondition) {
        if (parentCondition.ifRecId === visibilityConditionId) {
          await db.configurationVisibilityCondition.update({
            where: { id: parentCondition.id },
            data: { ifRecId: null },
          });
        } else if (parentCondition.elseRecId === visibilityConditionId) {
          await db.configurationVisibilityCondition.update({
            where: { id: parentCondition.id },
            data: { elseRecId: null },
          });
        }
      }
    }

    // Aggiorna la cache delle pagine dopo la cancellazione
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/configuration/${configuration.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function CreateSelectorOptionChange(
  selectorOptionId: string,
  data: AddNewSelectorOptionChangeType,
  socketId: string
) {
  const selectorOption = await GetSelectorOptionById(selectorOptionId);

  if (!selectorOption) {
    return { error: "SelectorOption non trovato" };
  }

  const selector = await GetSelectorById(selectorOption.selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const trailer = await GetTrailerById(category.trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  // 1. Validazione dello schema
  const validForm = AddNewSelectorOptionChangeSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  const {
    haveIf,
    configurationId,
    checkType,
    expectedValue,
    change,
    elseChange,
    isFirstNode,
    parentId,
    isElseRec,
    isIfRec,
  } = validForm.data;

  if (!isFirstNode) {
    const parentChange = await db.selectorOptionChange.findUnique({
      where: { id: parentId },
    });

    if (!parentChange) {
      return { error: "Parent non trovato" };
    }
  }

  try {
    // 3. Creazione del `SelectorOptionChange`
    const selectorOptionChange = await db.selectorOptionChange.create({
      data: {
        selectorOptionId,
        haveIf,
        configurationId: configurationId || null,
        checkType: checkType || "EQUAL",
        expectedValue: expectedValue || null,
        parentId: parentId,
        isFirstNode,
      },
    });

    if (isFirstNode) {
      await db.selectorOption.update({
        where: { id: selectorOptionId },
        data: {
          selectorOptionFirstNode: {
            push: selectorOptionChange.id,
          },
        },
      });
    }

    if (isIfRec) {
      await db.selectorOptionChange.update({
        where: {
          id: parentId,
        },
        data: {
          ifRecId: {
            push: selectorOptionChange.id,
          },
        },
      });
    } else if (isElseRec) {
      await db.selectorOptionChange.update({
        where: {
          id: parentId,
        },
        data: {
          elseRecId: {
            push: selectorOptionChange.id,
          },
        },
      });
    }

    // 4. Creazione delle azioni di cambiamento per `if` e `else`
    if (change.length > 0) {
      for (const changeAction of change) {
        await db.selectorOptionChangeAction.create({
          data: {
            configurationToChangeId: changeAction.configurationToChangeId,
            newValueValue: changeAction.newValueValue,
            selectorOptionChangeId: selectorOptionChange.id,
          },
        });
      }
    }

    if (haveIf && elseChange) {
      if (elseChange.length > 0) {
        for (const elseAction of elseChange) {
          await db.selectorOptionChangeAction.create({
            data: {
              configurationToChangeId: elseAction.configurationToChangeId,
              newValueValue: elseAction.newValueValue,
              selectorOptionElseChangeId: selectorOptionChange.id,
            },
          });
        }
      }
    }

    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    // 5. Ritorna il risultato
    return {
      success: true,
      selectorOptionChange,
      updatePath: `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`,
    };
  } catch (err) {
    console.error("Errore nella creazione:", err);
    return { error: "Errore nella creazione" };
  }
}

export async function DeleteSelectorOptionChange(
  changeId: string,
  socketId: string
) {
  // Ottieni il cambiamento corrente
  const selectorOptionChange = await GetSelectorOptionChangeById(changeId);

  if (!selectorOptionChange) {
    return { error: "Cambiamento non trovato" };
  }

  const selectorOption = await GetSelectorOptionById(
    selectorOptionChange.selectorOptionId
  );

  if (!selectorOption) {
    return { error: "Opzione del selettore non trovata" };
  }

  const selector = await GetSelectorById(selectorOption.selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // Funzione ricorsiva per cancellare tutti i nodi figli
  async function deleteChildChanges(conditionId: string) {
    const condition = await GetSelectorOptionChangeById(conditionId);

    if (!condition) return;

    if (condition.ifRecId && condition.ifRecId.length > 0) {
      for (const id of condition.ifRecId) {
        await deleteChildChanges(id);
      }
    }

    if (condition.elseRecId && condition.elseRecId.length > 0) {
      for (const id of condition.elseRecId) {
        await deleteChildChanges(id);
      }
    }

    // Cancella la condizione attuale
    await db.selectorOptionChange.delete({
      where: { id: conditionId },
    });
  }

  try {
    // Cancella i nodi figli ricorsivamente
    await deleteChildChanges(changeId);

    // Pulizia del collegamento nel nodo padre o nell'opzione del selettore
    if (selectorOptionChange.isFirstNode) {
      // Se è il nodo principale, pulisce il collegamento nell'opzione del selettore
      await db.selectorOption.update({
        where: { id: selectorOptionChange.selectorOptionId },
        data: {
          selectorOptionFirstNode: {
            set: selectorOption.selectorOptionFirstNode.filter(
              (id) => id !== changeId
            ),
          },
        },
      });
    } else {
      // Se non è il nodo principale, pulisce il collegamento nel nodo padre
      const parentChange = await GetSelectorOptionChangeById(
        selectorOptionChange.parentId!
      );

      if (parentChange) {
        if (parentChange.ifRecId.includes(changeId)) {
          await db.selectorOptionChange.update({
            where: { id: parentChange.id },
            data: {
              ifRecId: parentChange.ifRecId.filter((id) => id !== changeId),
            },
          });
        } else if (parentChange.elseRecId.includes(changeId)) {
          await db.selectorOptionChange.update({
            where: { id: parentChange.id },
            data: {
              elseRecId: parentChange.elseRecId.filter((id) => id !== changeId),
            },
          });
        }
      }
    }

    // Aggiorna la cache delle pagine dopo la cancellazione
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return {
      success: true,
      updatePath: `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`,
    };
  } catch (err) {
    console.error("Errore nella cancellazione:", err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function UpdateSelectorOptionChange(
  selectorOptionChangeId: string,
  data: EditNewSelectorOptionChangeType,
  socketId: string
) {
  const selectorOptionChange = await db.selectorOptionChange.findUnique({
    where: { id: selectorOptionChangeId },
  });

  if (!selectorOptionChange) {
    return { error: "SelectorOptionChange non trovato" };
  }

  const selectorOption = await GetSelectorOptionById(
    selectorOptionChange.selectorOptionId
  );

  if (!selectorOption) {
    return { error: "SelectorOption non trovato" };
  }

  const selector = await GetSelectorById(selectorOption.selectorId);

  if (!selector) {
    return { error: "Selettore non trovato" };
  }

  const variant = await GetVariantyById(selector.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const trailer = await GetTrailerById(category.trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  // 1. Validazione dello schema
  const validForm = EditNewSelectorOptionChangeSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  const {
    haveIf,
    configurationId,
    checkType,
    expectedValue,
    change,
    elseChange,
  } = validForm.data;

  try {
    // 2. Aggiornamento del `SelectorOptionChange`
    await db.selectorOptionChange.update({
      where: { id: selectorOptionChangeId },
      data: {
        haveIf,
        configurationId: configurationId || null,
        checkType: checkType || "EQUAL",
        expectedValue: expectedValue || null,
      },
    });

    // 3. Rimozione delle azioni di cambiamento esistenti
    await db.selectorOptionChangeAction.deleteMany({
      where: {
        OR: [
          { selectorOptionChangeId: selectorOptionChangeId },
          { selectorOptionElseChangeId: selectorOptionChangeId },
        ],
      },
    });

    // 4. Creazione delle nuove azioni di cambiamento per `if` e `else`
    if (change.length > 0) {
      for (const changeAction of change) {
        await db.selectorOptionChangeAction.create({
          data: {
            configurationToChangeId: changeAction.configurationToChangeId,
            newValueValue: changeAction.newValueValue,
            selectorOptionChangeId: selectorOptionChangeId,
          },
        });
      }
    }

    if (haveIf && elseChange) {
      if (elseChange.length > 0) {
        for (const elseAction of elseChange) {
          await db.selectorOptionChangeAction.create({
            data: {
              configurationToChangeId: elseAction.configurationToChangeId,
              newValueValue: elseAction.newValueValue,
              selectorOptionElseChangeId: selectorOptionChangeId,
            },
          });
        }
      }
    }

    // Aggiorna il path
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    // 5. Ritorna il risultato
    return {
      success: true,
      selectorOptionChange,
      updatePath: `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${selector.id}`,
    };
  } catch (err) {
    console.error("Errore nell'aggiornamento:", err);
    return { error: "Errore nell'aggiornamento" };
  }
}

export async function CreateNode(
  data: CreateNodeType,
  variantId: string,
  socketId: string
) {
  // Validazione dello schema senza il variantId
  const validationResult = CreateNodeSchema.safeParse(data);

  if (!validationResult.success) {
    return { error: "Dati non validi", issues: validationResult.error.issues };
  }

  const { name, alwaysHidden } = validationResult.data;

  // Recupera la variante associata al nodo
  const variant = await GetVariantyById(variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  // Recupera la categoria associata alla variante
  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // Recupera il rimorchio associato alla categoria
  const trailer = await GetTrailerById(category.trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  try {
    // Creazione del nuovo nodo
    const newNode = await db.node.create({
      data: {
        name,
        alwaysHidden: alwaysHidden ?? false,
        variantId, // Usa variantId passato come argomento
      },
    });

    // Rendi il path relativo alla pagina aggiornata
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return {
      success: true,
      node: newNode,
    };
  } catch (err) {
    console.error("Errore nella creazione del nodo:", err);
    return { error: "Errore nella creazione del nodo" };
  }
}

export async function DeleteNode(nodeId: string, socketId: string) {
  // Step 1: Verifica se il nodo esiste
  const node = await db.node.findUnique({
    where: { id: nodeId },
  });

  if (!node) {
    return { error: "Nodo non trovato" };
  }

  // Step 2: Verifica se esiste una relazione con la variante
  const variant = await db.variant.findUnique({
    where: { id: node.variantId },
  });

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await db.category.findUnique({
    where: { id: variant.categoryId },
  });

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const trailer = await db.trailer.findUnique({
    where: { id: category.trailerId },
  });

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  const configurationChanges = await db.configurationChange.findMany({
    where: {
      OR: [
        {
          change: {
            some: {
              nodeId: nodeId, // Usato come nodo in un cambiamento if
            },
          },
        },
        {
          elseChange: {
            some: {
              nodeId: nodeId, // Usato come nodo in un cambiamento else
            },
          },
        },
      ],
    },
    include: {
      configurationValue: {
        include: {
          configuration: true, // Includi la configurazione associata
        },
      },
    },
  });

  if (configurationChanges.length > 0) {
    const allConfigurationsWithNode =
      configurationChanges
        .map((change) => change.configurationValue.configuration.name)
        .join(", ") + ".";

    const errorMessage = `Il nodo è utilizzato nei cambiamenti delle seguenti configurazioni: ${allConfigurationsWithNode}`;
    return { message: errorMessage, youCant: true };
  }

  try {
    // Step 3: Elimina il nodo
    await db.node.delete({
      where: { id: nodeId },
    });

    // Step 4: Rendi il path relativo alla pagina aggiornata
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.error("Errore nella cancellazione del nodo:", err);
    return { error: "Errore nella cancellazione del nodo" };
  }
}

export async function DeleteAllNodesOfVariant(
  variantId: string,
  socketId: string
) {
  // Step 1: Check if the variant exists
  const variant = await db.variant.findUnique({
    where: { id: variantId },
  });

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  // Step 2: Get the category associated with the variant
  const category = await db.category.findUnique({
    where: { id: variant.categoryId },
  });

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // Step 3: Get the trailer associated with the category
  const trailer = await db.trailer.findUnique({
    where: { id: category.trailerId },
  });

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  // Step 4: Retrieve all nodes of the variant
  const nodes = await db.node.findMany({
    where: { variantId: variantId },
  });

  if (nodes.length === 0) {
    return { message: "Non ci sono nodi da eliminare per questa variante" };
  }

  // Step 5: Collect all node IDs
  const nodeIds = nodes.map((node) => node.id);

  // Step 6: Check if any nodes are used in configuration changes
  const configurationChanges = await db.configurationChange.findMany({
    where: {
      OR: [
        {
          change: {
            some: {
              nodeId: {
                in: nodeIds, // Used as node in a change 'if'
              },
            },
          },
        },
        {
          elseChange: {
            some: {
              nodeId: {
                in: nodeIds, // Used as node in a change 'else'
              },
            },
          },
        },
      ],
    },
    include: {
      configurationValue: {
        include: {
          configuration: true, // Include the associated configuration
        },
      },
    },
  });

  if (configurationChanges.length > 0) {
    const configurationsWithNodes =
      configurationChanges
        .map((change) => change.configurationValue.configuration.name)
        .join(", ") + ".";

    const errorMessage = `Alcuni nodi sono utilizzati nei cambiamenti delle seguenti configurazioni: ${configurationsWithNodes}`;
    return { message: errorMessage, youCant: true };
  }

  try {
    // Step 7: Delete all nodes of the variant
    await db.node.deleteMany({
      where: { variantId: variantId },
    });

    // Step 8: Revalidate the path related to the updated page
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.error("Errore nella cancellazione dei nodi:", err);
    return { error: "Errore nella cancellazione dei nodi" };
  }
}

export async function UpdateNode(
  nodeId: string,
  data: CreateNodeType,
  socketId: string
) {
  // Step 1: Verifica se il nodo esiste
  const node = await db.node.findUnique({
    where: { id: nodeId },
  });

  if (!node) {
    return { error: "Nodo non trovato" };
  }

  // Step 2: Verifica se esiste una relazione con la variante
  const variant = await db.variant.findUnique({
    where: { id: node.variantId },
  });

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await db.category.findUnique({
    where: { id: variant.categoryId },
  });

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  const trailer = await db.trailer.findUnique({
    where: { id: category.trailerId },
  });

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  // Step 3: Validazione dei dati in ingresso
  const validData = CreateNodeSchema.safeParse(data);

  if (!validData.success) {
    return { error: "Dati non validi", details: validData.error.errors };
  }

  try {
    // Step 4: Aggiorna il nodo
    const updatedNode = await db.node.update({
      where: { id: nodeId },
      data: {
        name: validData.data.name,
        alwaysHidden: validData.data.alwaysHidden,
      },
    });

    // Step 5: Rendi il path relativo alla pagina aggiornata
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/nodes`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true, node: updatedNode };
  } catch (err) {
    console.error("Errore nell'aggiornamento del nodo:", err);
    return { error: "Errore nell'aggiornamento del nodo" };
  }
}

export async function DuplicateSelector(
  selectorId: string,
  socketId: string
): Promise<{ newSelector?: Selector; error?: string }> {
  // 1. Ottenere il selettore originale
  const originalSelector = await GetSelectorById(selectorId);

  if (!originalSelector) {
    return { error: "Selettore non trovato" };
  }

  // 2. Creare un nuovo nome per il selettore duplicato
  let newName = `${originalSelector.name} - Copia`;
  let count = 1;

  // Controllare se esiste già un selettore con questo nome e incrementare il contatore se necessario
  while (await db.selector.findFirst({ where: { name: newName } })) {
    count++;
    newName = `${originalSelector.name} - Copia ${count}`;
  }

  const variant = await GetVariantyById(originalSelector.variantId);
  if (!variant) {
    return { error: "Variante non trovata" };
  }

  const category = await GetCategoryById(variant.categoryId);
  if (!category) {
    return { error: "Categoria non trovata" };
  }

  try {
    // 3. Determinare l'ultimo ordine utilizzato
    const lastOrder = await db.selector.findFirst({
      where: { variantId: variant.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastOrder ? lastOrder.order + 1 : 1;

    // 4. Creare il selettore duplicato
    const newSelector = await db.selector.create({
      data: {
        name: newName,
        description: originalSelector.description,
        configurationToRefer: originalSelector.configurationToRefer,
        order: newOrder,
        visible: originalSelector.visible,
        variantId: originalSelector.variantId,
        isColorSelector: originalSelector.isColorSelector,
        moreInfoModal: originalSelector.moreInfoModal,
        moreInfoDescription: originalSelector.moreInfoDescription,
        moreInfoImages: originalSelector.moreInfoImages,
      },
    });

    // 5. Duplicare le opzioni del selettore
    for (const option of originalSelector.options) {
      await duplicateSelectorOption(option.id, newSelector.id);
    }

    // 6. Duplicare la condizione di visibilità del selettore, se esistente
    if (originalSelector.visibilityConditionId) {
      const newVisibilityConditionId =
        await duplicateSelectorVisibilityCondition(
          originalSelector.visibilityConditionId,
          newSelector.id,
          true
        );

      await db.selector.update({
        where: { id: newSelector.id },
        data: { visibilityConditionId: newVisibilityConditionId },
      });
    }

    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${variant.id}/selector/${newSelector.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { newSelector };
  } catch (err) {
    console.error(err);
    return { error: "Errore nella duplicazione del selettore" };
  }
}

async function duplicateSelectorOption(
  optionId: string,
  newSelectorId: string
): Promise<void> {
  // Recupera l'opzione del selettore originale con tutte le relazioni necessarie
  const option = await db.selectorOption.findUnique({
    where: { id: optionId },
    include: {
      selectorOptionChange: true, // Includi le relazioni di cambio
    },
  });

  if (!option) {
    throw new Error("Opzione del selettore non trovata");
  }

  // Creare la nuova opzione duplicata
  const newOption = await db.selectorOption.create({
    data: {
      label: option.label,
      valueOfConfigurationToRefer: option.valueOfConfigurationToRefer,
      visible: option.visible,
      modalDescription: option.modalDescription,
      images: option.images,
      order: option.order,
      selectorId: newSelectorId,
      block: option.block,
      colorCodePrincipal: option.colorCodePrincipal,
      colorCodeSecondary: option.colorCodeSecondary,
      hasSecondaryColor: option.hasSecondaryColor,
    },
  });

  //Duplicare tutti i cambiamenti dell'opzione
  for (const firstNodeId of option.selectorOptionFirstNode) {
    await DuplicateSelectorOptionChange(
      firstNodeId,
      newOption.id,
      newOption.id,
      true,
      false,
      false
    );
  }
}

async function DuplicateSelectorOptionChange(
  originalNodeId: string,
  newSelectorOptionId: string,
  parentId: string,
  isFirstNode: boolean = false,
  isIfRec: boolean = false,
  isElseRec: boolean = false
): Promise<string> {
  // Recupera il nodo originale
  const originalNode = await db.selectorOptionChange.findUnique({
    where: { id: originalNodeId },
    include: {
      change: true, // Includi la relazione 'change'
      elseChange: true, // Includi la relazione 'elseChange'
    },
  });

  if (!originalNode) {
    throw new Error("Nodo del selettore non trovato");
  }

  // Duplica il nodo originale
  const newNode = await db.selectorOptionChange.create({
    data: {
      haveIf: originalNode.haveIf,
      configurationId: originalNode.configurationId,
      checkType: originalNode.checkType,
      expectedValue: originalNode.expectedValue,
      parentId: parentId,
      isFirstNode: isFirstNode,
      selectorOptionId: newSelectorOptionId,
    },
  });

  if (isFirstNode) {
    await db.selectorOption.update({
      where: { id: parentId },
      data: {
        selectorOptionFirstNode: {
          push: newNode.id,
        },
      },
    });
  }

  if (isIfRec) {
    await db.selectorOptionChange.update({
      where: {
        id: parentId,
      },
      data: {
        ifRecId: {
          push: newNode.id,
        },
      },
    });
  } else if (isElseRec) {
    await db.selectorOptionChange.update({
      where: {
        id: parentId,
      },
      data: {
        elseRecId: {
          push: newNode.id,
        },
      },
    });
  }

  if (originalNode.change.length > 0) {
    for (const changeAction of originalNode.change) {
      await db.selectorOptionChangeAction.create({
        data: {
          configurationToChangeId: changeAction.configurationToChangeId,
          newValueValue: changeAction.newValueValue,
          selectorOptionChangeId: newNode.id,
        },
      });
    }
  }

  if (originalNode.haveIf && originalNode.elseChange) {
    if (originalNode.elseChange.length > 0) {
      for (const elseAction of originalNode.elseChange) {
        await db.selectorOptionChangeAction.create({
          data: {
            configurationToChangeId: elseAction.configurationToChangeId,
            newValueValue: elseAction.newValueValue,
            selectorOptionElseChangeId: newNode.id,
          },
        });
      }
    }
  }

  // Duplica ricorsivamente tutti i rami 'ifRecId'
  if (originalNode.ifRecId && originalNode.ifRecId.length > 0) {
    const newIfRecIds = [];
    for (const ifRecId of originalNode.ifRecId) {
      const newIfRecId = await DuplicateSelectorOptionChange(
        ifRecId,
        newSelectorOptionId,
        newNode.id,
        false,
        true,
        false
      );
      newIfRecIds.push(newIfRecId);
    }
  }

  // Duplica ricorsivamente tutti i rami 'elseRecId'
  if (originalNode.elseRecId && originalNode.elseRecId.length > 0) {
    const newElseRecIds = [];
    for (const elseRecId of originalNode.elseRecId) {
      const newElseRecId = await DuplicateSelectorOptionChange(
        elseRecId,
        newSelectorOptionId,
        newNode.id,
        false,
        false,
        true
      );
      newElseRecIds.push(newElseRecId);
    }
  }

  return newNode.id;
}

async function duplicateSelectorVisibilityCondition(
  visibilityConditionId: string,
  newSelectorId: string,
  isFirstNode: boolean,
  parentId: string | null = null
): Promise<string> {
  const originalCondition = await GetVisibilityConditionById(
    visibilityConditionId
  );

  if (!originalCondition) {
    throw new Error("Condizione di visibilità non trovata");
  }

  // Creare la nuova condizione di visibilità duplicata
  const newCondition = await db.selectorVisibilityCondition.create({
    data: {
      configurationId: originalCondition.configurationId,
      checkType: originalCondition.checkType,
      expectedValue: originalCondition.expectedValue,
      ifVisible: originalCondition.ifVisible,
      elseVisible: originalCondition.elseVisible,
      parentId: parentId,
      isFirstNode: isFirstNode,
      selectorId: newSelectorId,
    },
  });

  // Duplicare ricorsivamente i rami "if" e "else"
  if (originalCondition.ifRecId) {
    const newIfRecId = await duplicateSelectorVisibilityCondition(
      originalCondition.ifRecId,
      newSelectorId,
      false,
      newCondition.id
    );
    await db.selectorVisibilityCondition.update({
      where: { id: newCondition.id },
      data: { ifRecId: newIfRecId },
    });
  }

  if (originalCondition.elseRecId) {
    const newElseRecId = await duplicateSelectorVisibilityCondition(
      originalCondition.elseRecId,
      newSelectorId,
      false,
      newCondition.id
    );
    await db.selectorVisibilityCondition.update({
      where: { id: newCondition.id },
      data: { elseRecId: newElseRecId },
    });
  }

  return newCondition.id;
}

export async function CreateConfigurationChange(
  configurationValueId: string,
  data: AddNewConfigurationChangeType,
  socketId: string
) {
  // 1. Recupera il ConfigurationValue associato
  const configurationValue = await GetConfigurationValueById(
    configurationValueId
  );

  if (!configurationValue) {
    return { error: "ConfigurationValue non trovato" };
  }

  // 2. Recupera la Configuration associata
  const configuration = await GetConfigurationById(
    configurationValue.configurationId
  );

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  // 3. Recupera la Variant associata
  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  // 4. Recupera la Category associata
  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // 5. Recupera il Trailer associato
  const trailer = await GetTrailerById(category.trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  // 6. Validazione dello schema
  const validForm = AddNewConfigurationChangeSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido", details: validForm.error.errors };
  }

  const {
    haveIf,
    configurationId,
    checkType,
    expectedValue,
    change,
    elseChange,
    isFirstNode,
    parentId,
    isElseRec,
    isIfRec,
    isElse,
  } = validForm.data;

  // 7. Controlla l'esistenza del parent se non è il primo nodo
  if (!isFirstNode) {
    const parentChange = await db.configurationChange.findUnique({
      where: { id: parentId },
    });

    if (!parentChange) {
      return { error: "Parent non trovato" };
    }
  }

  try {
    // 8. Creazione del `ConfigurationChange`
    const configurationChange = await db.configurationChange.create({
      data: {
        configurationValueId,
        haveIf,
        configurationId: configurationId || null,
        checkType: checkType || "EQUAL",
        expectedValue: expectedValue || null,
        parentId: parentId,
        isFirstNode,
      },
    });

    // 9. Aggiorna ConfigurationValue se è il primo nodo
    if (isFirstNode) {
      if (isElse) {
        await db.configurationValue.update({
          where: { id: configurationValueId },
          data: {
            configurationElseChangeFirstNode: {
              push: configurationChange.id,
            },
          },
        });
      } else {
        await db.configurationValue.update({
          where: { id: configurationValueId },
          data: {
            configurationChangeFirstNode: {
              push: configurationChange.id,
            },
          },
        });
      }
    }

    // 10. Aggiorna il nodo parent con ifRecId o elseRecId se necessario
    if (isIfRec) {
      await db.configurationChange.update({
        where: {
          id: parentId,
        },
        data: {
          ifRecId: {
            push: configurationChange.id,
          },
        },
      });
    } else if (isElseRec) {
      await db.configurationChange.update({
        where: {
          id: parentId,
        },
        data: {
          elseRecId: {
            push: configurationChange.id,
          },
        },
      });
    }

    // 11. Creazione delle azioni di cambiamento per `change` e `elseChange`
    if (change && change.length > 0) {
      for (const changeAction of change) {
        await db.configurationChangeAction.create({
          data: {
            nodeId: changeAction.nodeId,
            visible: changeAction.visible,
            changePosition: changeAction.changePosition,
            changeScale: changeAction.changeScale,
            position: changeAction.position,
            scale: changeAction.scale,
            configurationChangeId: configurationChange.id,
          },
        });
      }
    }

    if (haveIf && elseChange && elseChange.length > 0) {
      for (const elseAction of elseChange) {
        await db.configurationChangeAction.create({
          data: {
            nodeId: elseAction.nodeId,
            visible: elseAction.visible,
            changePosition: elseAction.changePosition,
            changeScale: elseAction.changeScale,
            position: elseAction.position || undefined,
            scale: elseAction.scale || undefined,
            configurationElseChangeId: configurationChange.id,
          },
        });
      }
    }

    // 12. Rivalida il percorso
    revalidatePath(
      `/admin/rimorchi/${trailer.id}/${category.id}/${variant.id}/configurazione/${configuration.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    // 13. Ritorna il risultato
    return {
      success: true,
      configurationChange,
      updatePath: `/admin/rimorchi/${trailer.id}/${category.id}/${variant.id}/configurazione/${configuration.id}`,
    };
  } catch (err) {
    console.error("Errore nella creazione:", err);
    return { error: "Errore nella creazione" };
  }
}

export async function DeleteConfigurationChange(
  configurationChangeId: string,
  socketId: string
) {
  // 1. Ottieni il cambiamento di configurazione corrente
  const configurationChange = await GetConfigurationChangeById(
    configurationChangeId
  );

  if (!configurationChange || !configurationChange.configurationValueId) {
    return { error: "Cambiamento di configurazione non trovato" };
  }

  const configurationValue = await GetConfigurationValueById(
    configurationChange.configurationValueId
  );

  if (!configurationValue) {
    return { error: "Valore di configurazione non trovato" };
  }

  // 2. Recupera la configurazione associata
  const configuration = await GetConfigurationById(
    configurationValue.configurationId
  );

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  // 3. Recupera la variante associata
  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  // 4. Recupera la categoria associata
  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // 5. Recupera il trailer associato
  const trailer = await GetTrailerById(category.trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  // Funzione ricorsiva per cancellare tutti i cambiamenti figli
  async function deleteChildChanges(changeId: string) {
    const change = await GetConfigurationChangeById(changeId);

    if (!change) return;

    // Cancella i cambiamenti figli if
    if (change.ifRecId && change.ifRecId.length > 0) {
      for (const childId of change.ifRecId) {
        await deleteChildChanges(childId);
      }
    }

    // Cancella i cambiamenti figli else
    if (change.elseRecId && change.elseRecId.length > 0) {
      for (const childId of change.elseRecId) {
        await deleteChildChanges(childId);
      }
    }

    // Cancella le azioni di cambiamento
    await db.configurationChangeAction.deleteMany({
      where: { configurationChangeId: change.id },
    });

    // Cancella la configurazione del cambiamento
    await db.configurationChange.delete({
      where: { id: change.id },
    });
  }

  try {
    // Cancella i cambiamenti figli ricorsivamente
    await deleteChildChanges(configurationChangeId);

    // Pulizia del collegamento nel nodo padre o nel valore della configurazione
    if (configurationChange.isFirstNode) {
      // Se è il nodo principale, pulisce il collegamento nel valore della configurazione
      if (
        configurationValue.configurationChangeFirstNode.includes(
          configurationChangeId
        )
      ) {
        await db.configurationValue.update({
          where: { id: configurationChange.configurationValueId },
          data: {
            configurationChangeFirstNode: {
              set: configurationValue.configurationChangeFirstNode.filter(
                (id) => id !== configurationChangeId
              ),
            },
          },
        });
      } else {
        await db.configurationValue.update({
          where: { id: configurationChange.configurationValueId },
          data: {
            configurationElseChangeFirstNode: {
              set: configurationValue.configurationElseChangeFirstNode.filter(
                (id) => id !== configurationChangeId
              ),
            },
          },
        });
      }
    } else {
      // Se non è il nodo principale, pulisce il collegamento nel nodo padre
      const parentChange = await GetConfigurationChangeById(
        configurationChange.parentId!
      );

      if (parentChange) {
        if (parentChange.ifRecId.includes(configurationChangeId)) {
          await db.configurationChange.update({
            where: { id: parentChange.id },
            data: {
              ifRecId: {
                set: parentChange.ifRecId.filter(
                  (id) => id !== configurationChangeId
                ),
              },
            },
          });
        } else if (parentChange.elseRecId.includes(configurationChangeId)) {
          await db.configurationChange.update({
            where: { id: parentChange.id },
            data: {
              elseRecId: {
                set: parentChange.elseRecId.filter(
                  (id) => id !== configurationChangeId
                ),
              },
            },
          });
        }
      }
    }

    // Aggiorna la cache delle pagine dopo la cancellazione
    revalidatePath(
      `/admin/rimorchi/${trailer.id}/${category.id}/${variant.id}/configuration/${configuration.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { success: true };
  } catch (err) {
    console.error("Errore nella cancellazione:", err);
    return { error: "Errore nella cancellazione" };
  }
}

export async function UpdateConfigurationChange(
  configurationChangeId: string,
  data: EditConfigurationChangeType,
  socketId: string
) {
  // 1. Recupera il `ConfigurationChange` associato
  const configurationChange = await GetConfigurationChangeById(
    configurationChangeId
  );

  if (!configurationChange) {
    return { error: "ConfigurationChange non trovato" };
  }

  // 2. Recupera il `ConfigurationValue` associato
  const configurationValue = await GetConfigurationValueById(
    configurationChange.configurationValueId
  );

  if (!configurationValue) {
    return { error: "ConfigurationValue non trovato" };
  }

  // 3. Recupera la `Configuration` associata
  const configuration = await GetConfigurationById(
    configurationValue.configurationId
  );

  if (!configuration) {
    return { error: "Configurazione non trovata" };
  }

  // 4. Recupera la `Variant` associata
  const variant = await GetVariantyById(configuration.variantId);

  if (!variant) {
    return { error: "Variante non trovata" };
  }

  // 5. Recupera la `Category` associata
  const category = await GetCategoryById(variant.categoryId);

  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // 6. Recupera il `Trailer` associato
  const trailer = await GetTrailerById(category.trailerId);

  if (!trailer) {
    return { error: "Rimorchio non trovato" };
  }

  // 7. Validazione dello schema
  const validForm = EditConfigurationChangeSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido", details: validForm.error.errors };
  }

  const {
    haveIf,
    configurationId,
    checkType,
    expectedValue,
    change,
    elseChange,
  } = validForm.data;

  try {
    // 8. Aggiornamento del `ConfigurationChange`
    await db.configurationChange.update({
      where: { id: configurationChangeId },
      data: {
        haveIf,
        configurationId: configurationId || null,
        checkType: checkType || "EQUAL",
        expectedValue: expectedValue || null,
      },
    });

    // 9. Rimozione delle azioni di cambiamento esistenti
    await db.configurationChangeAction.deleteMany({
      where: {
        OR: [
          { configurationChangeId: configurationChangeId },
          { configurationElseChangeId: configurationChangeId },
        ],
      },
    });

    // 10. Creazione delle nuove azioni di cambiamento per `change` e `elseChange`
    if (change && change.length > 0) {
      for (const changeAction of change) {
        await db.configurationChangeAction.create({
          data: {
            nodeId: changeAction.nodeId,
            visible: changeAction.visible,
            changePosition: changeAction.changePosition,
            changeScale: changeAction.changeScale,
            position: changeAction.position || undefined,
            scale: changeAction.scale || undefined,
            configurationChangeId: configurationChangeId,
          },
        });
      }
    }

    if (haveIf && elseChange && elseChange.length > 0) {
      for (const elseAction of elseChange) {
        await db.configurationChangeAction.create({
          data: {
            nodeId: elseAction.nodeId,
            visible: elseAction.visible,
            changePosition: elseAction.changePosition,
            changeScale: elseAction.changeScale,
            position: elseAction.position || undefined,
            scale: elseAction.scale || undefined,
            configurationElseChangeId: configurationChangeId,
          },
        });
      }
    }

    // 11. Rivalida il percorso
    revalidatePath(
      `/admin/rimorchi/${trailer.id}/${category.id}/${variant.id}/configurazione/${configuration.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    // 12. Ritorna il risultato
    return {
      success: true,
      configurationChange,
      updatePath: `/admin/rimorchi/${trailer.id}/${category.id}/${variant.id}/configurazione/${configuration.id}`,
    };
  } catch (err) {
    console.error("Errore nell'aggiornamento:", err);
    return { error: "Errore nell'aggiornamento" };
  }
}

export async function createNodesAction(
  variantId: string,
  nodeNames: string[],
  socketId: string
) {
  if (!variantId || !Array.isArray(nodeNames)) {
    return { error: "Dati non validi" };
  }

  try {
    // Verifica se la variante esiste
    const variant = await GetVariantyById(variantId);

    if (!variant) {
      return { error: "Variante non trovata" };
    }

    const category = await GetCategoryById(variant.categoryId);

    if (!category) {
      return { error: "Categoria non trovata" };
    }

    const trailer = await GetTrailerById(category.trailerId);

    if (!trailer) {
      return { error: "Rimorchio non trovato" };
    }

    // Creazione dei nodi
    const nodes = await Promise.all(
      nodeNames.map(async (name: string) => {
        return await db.node.create({
          data: {
            name,
            variantId: variantId,
            alwaysHidden: false, // Impostazioni di default per il nodo, personalizzabili
          },
        });
      })
    );

    revalidatePath(
      "/admin/rimorchi/" + trailer.id + "/" + category.id + "/" + variantId
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { message: "Nodi aggiunti con successo", nodes };
  } catch (error) {
    console.error("Error creating nodes:", error);
    return { error: "Problema con l'aggiunta dei nodi" };
  }
}

export async function DuplicateVariant(
  variantId: string,
  categoryId: string,
  socketId: string
) {
  // Ottieni la variante originale
  const originalVariant = await GetVariantByIdWithAllData(variantId);

  if (!originalVariant) {
    return { error: "Variante non trovata" };
  }

  // Ottieni la categoria target
  const category = await GetCategoryById(categoryId);
  if (!category) {
    return { error: "Categoria non trovata" };
  }

  // Crea il nuovo nome per la variante duplicata
  let newName = `${originalVariant.name} - Copia`;
  let count = 1;

  // Controlla se esiste già una variante con questo nome e incrementa il contatore se necessario
  while (
    await db.variant.findFirst({
      where: { categoryId: categoryId, name: newName },
    })
  ) {
    count++;
    newName = `${originalVariant.name} - Copia ${count}`;
  }

  try {
    // Crea la variante duplicata
    const newVariant = await db.variant.create({
      data: {
        name: newName,
        prezzo: originalVariant.prezzo,
        description: originalVariant.description,
        nomePrev: originalVariant.nomePrev,
        descriptionPrev: originalVariant.descriptionPrev,
        initialCameraPosition: originalVariant.initialCameraPosition,
        visible: originalVariant.visible,
        configurable: originalVariant.configurable,
        has3DModel: originalVariant.has3DModel,
        categoryId: categoryId,
        images: originalVariant.images,
        fileUrl: originalVariant.fileUrl,
      },
    });

    // 1. Duplica i nodi
    for (const node of originalVariant.nodes) {
      await duplicateNode(node, newVariant.id);
    }

    // 3. Duplica le configurazioni (senza modificare nome/ordine e senza rinfrescare il layout)
    for (const configuration of originalVariant.configurations) {
      await duplicateConfigurationWithoutUIUpdate(configuration, newVariant.id);
    }

    // 4. Duplica i selettori (senza modificare nome/ordine e senza rinfrescare il layout)
    for (const selector of originalVariant.selectors) {
      await duplicateSelectorWithoutUIUpdate(selector, newVariant.id);
    }

    // Aggiorna il layout una sola volta
    revalidatePath(
      `/admin/rimorchi/${category.trailerId}/${category.id}/${newVariant.id}`
    );

    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    return { newVariant };
  } catch (err) {
    console.error(err);
    return { error: "Errore nella duplicazione della variante" };
  }
}

async function duplicateNode(originalNode: Node, newVariantId: string) {
  // Crea il nodo duplicato
  await db.node.create({
    data: {
      name: originalNode.name,
      alwaysHidden: originalNode.alwaysHidden,
      variantId: newVariantId,
    },
  });
}

async function duplicateConfigurationWithoutUIUpdate(
  originalConfig: Prisma.ConfigurationGetPayload<{
    include: {
      values: true;
    };
  }>,
  newVariantId: string
) {
  // Crea la configurazione duplicata
  const newConfig = await db.configuration.create({
    data: {
      name: originalConfig.name,
      variantId: newVariantId,
      order: originalConfig.order,
      defaultValuePreventivo: originalConfig.defaultValuePreventivo,
      scount: originalConfig.scount,
    },
  });

  if (originalConfig.visibilityConditionId) {
    const newVisibilityConditionId = await duplicateVisibilityCondition(
      originalConfig.visibilityConditionId,
      newConfig.id,
      true
    );

    await db.configuration.update({
      where: { id: newConfig.id },
      data: { visibilityConditionId: newVisibilityConditionId },
    });
  }

  for (const originalValue of originalConfig.values) {
    const isDefault = originalValue.id === originalConfig.defaultValue;
    const isDefaultPreventivo =
      originalValue.id === originalConfig.defaultValuePreventivo;

    await duplicateConfigurationValue(
      originalValue.id,
      newConfig.id,
      isDefault,
      isDefaultPreventivo
    );
  }
}

async function duplicateSelectorWithoutUIUpdate(
  originalSelector: Prisma.SelectorGetPayload<{
    include: {
      options: true;
    };
  }>,
  newVariantId: string
) {
  // Crea il selettore duplicato
  const newSelector = await db.selector.create({
    data: {
      name: originalSelector.name,
      description: originalSelector.description,
      configurationToRefer: originalSelector.configurationToRefer,
      order: originalSelector.order,
      visible: originalSelector.visible,
      variantId: newVariantId,
      isColorSelector: originalSelector.isColorSelector,
      moreInfoDescription: originalSelector.moreInfoDescription,
      moreInfoImages: originalSelector.moreInfoImages,
      moreInfoModal: originalSelector.moreInfoModal,
    },
  });

  // Duplicare le opzioni del selettore
  for (const option of originalSelector.options) {
    await duplicateSelectorOption(option.id, newSelector.id);
  }

  // Duplicare la condizione di visibilità del selettore, se esistente
  if (originalSelector.visibilityConditionId) {
    const newVisibilityConditionId = await duplicateSelectorVisibilityCondition(
      originalSelector.visibilityConditionId,
      newSelector.id,
      true
    );

    await db.selector.update({
      where: { id: newSelector.id },
      data: { visibilityConditionId: newVisibilityConditionId },
    });
  }
}

export async function DuplicateConfigurationToVariant(
  configurationId: string,
  targetVariantId: string,
  socketId: string
) {
  // Step 1: Retrieve the original configuration
  const originalConfig = await GetConfigurationById(configurationId);

  if (!originalConfig) {
    return { error: "Original configuration not found" };
  }

  // Step 2: Create a new name for the duplicated configuration in the target variant
  let newName = originalConfig.name;
  let count = 1;

  // Ensure the name is unique within the target variant
  while (
    await db.configuration.findFirst({
      where: { name: newName, variantId: targetVariantId },
    })
  ) {
    count++;
    newName = `${originalConfig.name} - Copia ${count}`;
  }

  // Step 3: Get the last order in the target variant
  const lastOrder = await db.configuration.findFirst({
    where: { variantId: targetVariantId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = lastOrder ? lastOrder.order + 1 : 1;

  try {
    // Step 4: Create the duplicated configuration in the target variant
    const newConfig = await db.configuration.create({
      data: {
        name: newName,
        variantId: targetVariantId,
        order: newOrder,
        defaultValuePreventivo: originalConfig.defaultValuePreventivo,
        scount: originalConfig.scount,
      },
      include: {
        variant: true,
      },
    });

    // Step 5: Duplicate visibility condition, if it exists
    if (originalConfig.visibilityConditionId) {
      const newVisibilityConditionId = await duplicateVisibilityCondition(
        originalConfig.visibilityConditionId,
        newConfig.id,
        true
      );

      await db.configuration.update({
        where: { id: newConfig.id },
        data: { visibilityConditionId: newVisibilityConditionId },
      });
    }

    // Step 6: Duplicate all values of the configuration
    for (const originalValue of originalConfig.values) {
      const isDefault = originalValue.id === originalConfig.defaultValue;
      const isDefaultPreventivo =
        originalValue.id === originalConfig.defaultValuePreventivo;

      await duplicateConfigurationValue(
        originalValue.id,
        newConfig.id,
        isDefault,
        isDefaultPreventivo
      );
    }

    // Emit the final update event
    await pusher.trigger("dashboard-channel", "page-refresh", null, {
      socket_id: socketId,
    });

    // Return the new configuration
    return { newConfig };
  } catch (err) {
    console.error("Error during configuration duplication:", err);
    return { error: "Error duplicating the configuration" };
  }
}
