import * as z from "zod";

export const CreateNewTrailerSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
  description: z.optional(z.string()),
  fornitore: z
    .string({ message: "Seleziona un fornitore" })
    .min(1, { message: "Seleziona un fornitore" }),
  images: z.optional(z.array(z.string())),
  visible: z.optional(z.boolean()),
});

export type CreateNewTrailerType = z.infer<typeof CreateNewTrailerSchema>;

export const CreateNewSottocategoriaSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
  description: z.optional(z.string()),
  visible: z.optional(z.boolean()),
});

export type CreateNewSottocategoriaType = z.infer<
  typeof CreateNewSottocategoriaSchema
>;

export const CreateNewVariantSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
  prezzo: z.number().min(0, { message: "Inserisci un numero valido" }),
  description: z.optional(z.string()),
  descriptionPrev: z.optional(z.string()),
  images: z.optional(z.array(z.string())),
  visible: z.optional(z.boolean()),
  configurable: z.optional(z.boolean()),
  has3DModel: z.optional(z.boolean()),
});

export type CreateNewVariantType = z.infer<typeof CreateNewVariantSchema>;

export const CreateNewConfigurationSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
  values: z
    .array(z.string().min(2, { message: "Inserisci un valore valido" }))
    .min(1, { message: "Inserisci alemno un elemento" }),
});

export type CreateNewConfigurationType = z.infer<
  typeof CreateNewConfigurationSchema
>;

export const EditConfigurationSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
  defaultValue: z.string().min(2, { message: "Inserisci un valore valido" }),
});

export type EditConfigurationType = z.infer<typeof EditConfigurationSchema>;

export const AddConfigurationValueSchema = z.object({
  values: z
    .array(z.string().min(2, { message: "Inserisci un valore valido" }))
    .min(1, { message: "Inserisci alemno un elemento" }),
});

export type AddConfigurationValueType = z.infer<
  typeof AddConfigurationValueSchema
>;

export const EditConfigurationValueSchema = z.object({
  value: z.string().min(2, { message: "Inserisci un valore valido" }),
  isFree: z.optional(z.boolean()),
  prezzo: z.optional(z.number({ message: "Inserisci un valore numerico" })),
  hasText: z.optional(z.boolean()),
  text: z.optional(z.string()),
});

export type EditConfigurationValueType = z.infer<
  typeof EditConfigurationValueSchema
>;

export const CreateNewSelectorSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
  configurationToRefer: z
    .string()
    .min(4, { message: "Inserisci un valore valido" }),
  values: z.array(
    z.object({
      label: z.string().min(2, { message: "Inserisci un valore valido" }),
      valueOfConfigurationToRefer: z
        .string()
        .min(4, { message: "Inserisci un valore valido" }),
    })
  ),
});

export type CreateNewSelectorType = z.infer<typeof CreateNewSelectorSchema>;

export const EditSelectorSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
  description: z.optional(z.string()),
  visible: z.optional(z.boolean()),
});

export type EditSelectorType = z.infer<typeof EditSelectorSchema>;

export const AddSelectorOptionSchema = z.object({
  label: z.string().min(2, { message: "Inserisci un valore valido" }),
  valueOfConfigurationToRefer: z
    .string()
    .min(4, { message: "Inserisci un valore valido" }),
});

export type AddSelectorOptionType = z.infer<typeof AddSelectorOptionSchema>;

export const EditSelectorOptionSchema = z.object({
  label: z.string().min(2, { message: "Inserisci un valore valido" }),
  visible: z.optional(z.boolean()),
  modalDescription: z.optional(z.string()),
  images: z.optional(z.array(z.string())),
});

export type EditSelectorOptionType = z.infer<typeof EditSelectorOptionSchema>;

export const AddNewVisibilityConditionSchema = z.object({
  configurationId: z.string().min(3, { message: "Inserisci un id valido" }),
  checkType: z.string().min(2, { message: "Inserisci un valore valido" }),
  expectedValue: z.string().min(3, { message: "Inserisci un valore valido" }),
  isFirstNode: z.optional(z.boolean()),
  isIfRec: z.optional(z.boolean()),
  isElseRec: z.optional(z.boolean()),
  parentId: z.string().min(3, { message: "Manca il parentId" }),
  ifVisible: z.optional(z.boolean()),
  elseVisible: z.optional(z.boolean()),
});

export type AddNewVisibilityConditionType = z.infer<
  typeof AddNewVisibilityConditionSchema
>;

export const EditVisibilityConditionSchema = z.object({
  configurationId: z.string().min(3, { message: "Inserisci un id valido" }),
  checkType: z.string().min(2, { message: "Inserisci un valore valido" }),
  expectedValue: z.string().min(3, { message: "Inserisci un valore valido" }),
  ifVisible: z.optional(z.boolean()),
  elseVisible: z.optional(z.boolean()),
});

export type EditVisibilityConditionType = z.infer<
  typeof EditVisibilityConditionSchema
>;

export const AddNewConfigurationVisibilityConditionSchema = z.object({
  configurationId: z.string().min(3, { message: "Inserisci un id valido" }),
  checkType: z.string().min(2, { message: "Inserisci un valore valido" }),
  expectedValue: z.string().min(3, { message: "Inserisci un valore valido" }),
  isFirstNode: z.optional(z.boolean()),
  isIfRec: z.optional(z.boolean()),
  isElseRec: z.optional(z.boolean()),
  parentId: z.string().min(3, { message: "Manca il parentId" }),
  ifVisible: z.optional(z.boolean()),
  elseVisible: z.optional(z.boolean()),
});

export type AddNewConfigurationVisibilityConditionType = z.infer<
  typeof AddNewConfigurationVisibilityConditionSchema
>;

export const EditConfigurationVisibilityConditionSchema = z.object({
  configurationId: z.string().min(3, { message: "Inserisci un id valido" }),
  checkType: z.string().min(2, { message: "Inserisci un valore valido" }),
  expectedValue: z.string().min(3, { message: "Inserisci un valore valido" }),
  ifVisible: z.optional(z.boolean()),
  elseVisible: z.optional(z.boolean()),
});

export type EditConfigurationVisibilityConditionType = z.infer<
  typeof EditConfigurationVisibilityConditionSchema
>;

// Schema per la singola azione di cambiamento
export const SelectorOptionChangeActionSchema = z.object({
  configurationToChangeId: z
    .string()
    .min(3, { message: "Inserisci un valore valido" }),
  newValueValue: z.string().min(3, { message: "Inserisci un valore valido" }),
});

// Schema per il nodo condizionale
export const AddNewSelectorOptionChangeSchema = z
  .object({
    haveIf: z.boolean().default(false), // Indica se esiste una struttura condizionale

    // Questi campi sono richiesti solo se haveIf è true
    configurationId: z
      .string()
      .min(3, { message: "Inserisci un id valido" })
      .optional()
      .nullable(),
    checkType: z.enum(["EQUAL", "NOTEQUAL"]).optional(),
    expectedValue: z
      .string()
      .min(3, { message: "Inserisci un valore valido" })
      .optional()
      .nullable(),

    isFirstNode: z.optional(z.boolean()),
    isIfRec: z.optional(z.boolean()),
    isElseRec: z.optional(z.boolean()),
    parentId: z.string().min(3, { message: "Manca il parentId" }),

    // Lista di cambiamenti per il ramo if e else
    change: z
      .array(SelectorOptionChangeActionSchema)
      .min(1, { message: "Aggiungi almeno un cambiamento" }),
    elseChange: z.array(SelectorOptionChangeActionSchema).optional(),
  })
  .refine(
    (data) => {
      // Controlla se haveIf è true, allora i campi devono essere presenti
      if (data.haveIf) {
        return data.configurationId && data.expectedValue;
      }
      return true; // Se haveIf è false, nessuna ulteriore validazione è necessaria
    },
    {
      message:
        "I campi configurazione e valore atteso sono obbligatori quando si ha la struttura a if/else",
      path: ["haveIf"], // Puoi specificare su quale campo verrà riportato l'errore
    }
  );

// Tipo TypeScript inferito dallo schema Zod
export type AddNewSelectorOptionChangeType = z.infer<
  typeof AddNewSelectorOptionChangeSchema
>;

export const EditNewSelectorOptionChangeSchema = z
  .object({
    haveIf: z.boolean().default(false), // Indica se esiste una struttura condizionale

    // Questi campi sono richiesti solo se haveIf è true
    configurationId: z
      .string()
      .min(3, { message: "Inserisci un id valido" })
      .optional()
      .nullable(),
    checkType: z.enum(["EQUAL", "NOTEQUAL"]).optional(),
    expectedValue: z
      .string()
      .min(3, { message: "Inserisci un valore valido" })
      .optional()
      .nullable(),

    // Lista di cambiamenti per il ramo if e else
    change: z
      .array(SelectorOptionChangeActionSchema)
      .min(1, { message: "Aggiungi almeno un cambiamento" }),
    elseChange: z.array(SelectorOptionChangeActionSchema).optional(),
  })
  .refine(
    (data) => {
      // Controlla se haveIf è true, allora i campi devono essere presenti
      if (data.haveIf) {
        return data.configurationId && data.expectedValue;
      }
      return true; // Se haveIf è false, nessuna ulteriore validazione è necessaria
    },
    {
      message:
        "I campi configurazione e valore atteso sono obbligatori quando si ha la struttura a if/else",
      path: ["haveIf"], // Puoi specificare su quale campo verrà riportato l'errore
    }
  );

export type EditNewSelectorOptionChangeType = z.infer<
  typeof EditNewSelectorOptionChangeSchema
>;

export const CreateNodeSchema = z.object({
  name: z.string().min(1, { message: "Il nome è obbligatorio" }),
  alwaysHidden: z.boolean().optional().default(false),
});

export type CreateNodeType = z.infer<typeof CreateNodeSchema>;

export const ConfigurationChangeActionSchema = z
  .object({
    nodeId: z
      .string()
      .min(3, { message: "Inserisci un id valido per il nodo" }),
    visible: z.boolean(),
    changePosition: z.boolean().default(false),
    changeScale: z.boolean().default(false),
    position: z
      .object({
        x: z.number().optional(),
        y: z.number().optional(),
        z: z.number().optional(),
      })
      .optional(),
    scale: z
      .object({
        x: z.number().optional(),
        y: z.number().optional(),
        z: z.number().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.changePosition) {
        return (
          data.position &&
          data.position.x !== undefined &&
          data.position.y !== undefined &&
          data.position.z !== undefined
        );
      }
      return true;
    },
    {
      message:
        "I campi x, y, e z di position devono essere presenti quando changePosition è vero",
      path: ["position"],
    }
  )
  .refine(
    (data) => {
      if (data.changeScale) {
        return (
          data.scale &&
          data.scale.x !== undefined &&
          data.scale.y !== undefined &&
          data.scale.z !== undefined
        );
      }
      return true;
    },
    {
      message:
        "I campi width e height di scale devono essere presenti quando changeScale è vero",
      path: ["scale"],
    }
  );

export type ConfigurationChangeActionType = z.infer<
  typeof ConfigurationChangeActionSchema
>;

export const AddNewConfigurationChangeSchema = z
  .object({
    haveIf: z.boolean().default(false), // Indica se esiste una struttura condizionale

    // Questi campi sono richiesti solo se haveIf è true
    configurationId: z
      .string()
      .min(3, { message: "Inserisci un id valido" })
      .optional()
      .nullable(),
    checkType: z.enum(["EQUAL", "NOTEQUAL"]).default("EQUAL"),
    expectedValue: z
      .string()
      .min(3, { message: "Inserisci un valore valido" })
      .optional()
      .nullable(),

    isFirstNode: z.boolean().default(false),
    isElse: z.boolean().default(false),
    parentId: z.string().min(3, { message: "Manca il parentId" }).optional(),
    isIfRec: z.boolean().optional(),
    isElseRec: z.boolean().optional(),

    // Lista di cambiamenti per il ramo if e else, ora opzionali
    change: z.array(ConfigurationChangeActionSchema).optional(),
    elseChange: z.array(ConfigurationChangeActionSchema).optional(),
  })
  .refine(
    (data) => {
      // Controlla se haveIf è true, allora i campi devono essere presenti
      if (data.haveIf) {
        return data.configurationId && data.expectedValue;
      }
      return true; // Se haveIf è false, nessuna ulteriore validazione è necessaria
    },
    {
      message:
        "I campi configurazione e valore atteso sono obbligatori quando si ha la struttura a if/else",
      path: ["haveIf"], // Campo su cui viene riportato l'errore
    }
  )
  .refine(
    (data) => {
      // Se haveIf è false, deve esserci almeno un change
      if (!data.haveIf) {
        return data.change && data.change.length > 0;
      }
      return true; // Se haveIf è true, nessuna ulteriore validazione è necessaria
    },
    {
      message:
        "Deve esserci almeno un cambiamento se la struttura condizionale (If/Else) non è presente",
      path: ["change"], // Campo su cui viene riportato l'errore
    }
  );

// Tipo TypeScript inferito dallo schema Zod
export type AddNewConfigurationChangeType = z.infer<
  typeof AddNewConfigurationChangeSchema
>;

// Reuse the ConfigurationChangeActionSchema for consistency
export const EditConfigurationChangeSchema = z
  .object({
    haveIf: z.boolean().default(false), // Indica se esiste una struttura condizionale

    // Questi campi sono richiesti solo se haveIf è true
    configurationId: z
      .string()
      .min(3, { message: "Inserisci un id valido" })
      .optional()
      .nullable(),
    checkType: z.enum(["EQUAL", "NOTEQUAL"]).default("EQUAL"),
    expectedValue: z
      .string()
      .min(3, { message: "Inserisci un valore valido" })
      .optional()
      .nullable(),

    // Lista di cambiamenti per il ramo if e else
    change: z.array(ConfigurationChangeActionSchema).optional(),
    elseChange: z.array(ConfigurationChangeActionSchema).optional(),
  })
  .refine(
    (data) => {
      // Controlla se haveIf è true, allora i campi devono essere presenti
      if (data.haveIf) {
        return data.configurationId && data.expectedValue;
      }
      return true; // Se haveIf è false, nessuna ulteriore validazione è necessaria
    },
    {
      message:
        "I campi configurazione e valore atteso sono obbligatori quando si ha la struttura a if/else",
      path: ["haveIf"], // Campo su cui viene riportato l'errore
    }
  )
  .refine(
    (data) => {
      // Se haveIf è false, deve esserci almeno un change
      if (!data.haveIf) {
        return data.change && data.change.length > 0;
      }
      return true; // Se haveIf è true, nessuna ulteriore validazione è necessaria
    },
    {
      message:
        "Deve esserci almeno un cambiamento se la struttura condizionale (If/Else) non è presente",
      path: ["change"], // Campo su cui viene riportato l'errore
    }
  );

// Tipo TypeScript inferito dallo schema Zod
export type EditConfigurationChangeType = z.infer<
  typeof EditConfigurationChangeSchema
>;

export const NewColorSchema = z.object({
  name: z.string().min(3, { message: "Inserisci un nome valido" }),
});

export type NewColorType = z.infer<typeof NewColorSchema>;

export const UpdateColorSchema = z.object({
  name: z.string().min(1, { message: "Il nome è obbligatorio" }),
  description: z.string().optional(),
  price: z.number().optional(),
  fileUrl: z.string().optional(),
  visible: z.boolean().optional(),
  has3DModel: z.boolean().optional(),
  hasSecondaryColor: z.boolean().optional(),
  colorCodePrincipal: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message:
      "Il codice colore principale deve essere un colore esadecimale valido",
  }),
  colorCodeSecondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message:
      "Il codice colore secondario deve essere un colore esadecimale valido",
  }),
  images: z
    .array(z.string().url({ message: "Deve essere un URL valido" }))
    .optional(),
});

export type UpdateColorType = z.infer<typeof UpdateColorSchema>;
