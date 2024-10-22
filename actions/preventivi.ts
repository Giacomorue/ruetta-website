"use server";

import { db } from "@/lib/prisma";
import { pusher } from "@/lib/pusherServer";
import { CreateNewPersonSchema, CreateNewPersonType } from "@/schemas/preventivi";

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
  Person,
  RequestConfiguration,
  RequestOfPrev,
} from "prisma/prisma-client";

export async function CreatePerson(
  data: CreateNewPersonType,
) {
  // Validazione del form
  const validForm = CreateNewPersonSchema.safeParse(data);

  if (!validForm.success) {
    return { error: "Form non valido" };
  }

  // Estrai i dati validati dal form
  const { ragioneSociale, citta, codiceFiscale, partitaIva, telefono, email } =
    validForm.data;

  try {
    // Creazione della nuova persona nel database
    const person = await db.person.create({
      data: {
        ragioneSociale,
        citta,
        codiceFiscale: codiceFiscale || null, // Usa null se non fornito
        partitaIva: partitaIva || null, // Usa null se non fornito
        telefono: telefono || null, // Usa null se non fornito
        email: email || null, // Usa null se non fornito
      },
    });

    // Emetti un evento per aggiornare la dashboard via Pusher
    await pusher.trigger("dashboard-channel", "page-refresh", null);

    // Revalida la cache della pagina
    revalidatePath("/admin/preventivi");

    // Restituisci la persona appena creata
    return { person };
  } catch (err) {
    console.error("Errore nella creazione della persona:", err);
    return { error: "Errore nella creazione" };
  }
}

export async function CreateRequestOfPrev(
  data: {
    personId?: string;
    ragioneSociale?: string;
    citta?: string;
    codiceFiscale?: string;
    partitaIva?: string;
    telefono?: string;
    email?: string;
    variantId: string;
    configurations: {
      configurationId: string;
      valueId: string;
    }[];
  }
) {
  let personId = data.personId;

  // Utilizziamo i dati della persona così come sono se forniti
  const personData = {
    personId: personId || null,
    ragioneSociale: data.ragioneSociale || null,
    citta: data.citta || null,
    codiceFiscale: data.codiceFiscale || null,
    partitaIva: data.partitaIva || null,
    telefono: data.telefono || null,
    email: data.email || null,
  };

  try {
    // 1. Recupera i dettagli delle configurazioni dal database
    const configurationsDetails: RequestConfiguration[] = await Promise.all(
      data.configurations.map(async (config) => {
        const configuration = await db.configuration.findUnique({
          where: { id: config.configurationId },
          include: {
            values: {
              where: { id: config.valueId },
            },
          },
        });

        if (!configuration || !configuration.values.length) {
          throw new Error("Configurazione o valore della configurazione non trovati");
        }

        const configurationValue = configuration.values[0];

        // Compiliamo i dettagli della configurazione
        return {
          configurationId: config.configurationId,
          configurationValueId: config.valueId,
          configurationScount: configuration.scount,
          configurationName: configuration.name,
          configurationValueName: configurationValue.value,
          configurationValueDescriptionBig: configurationValue.textBig || "",
          configurationValueDescriptionLittle: configurationValue.textLittle || "",
          configurationValuePrice: configurationValue.prezzo || 0,
          configugrationHasText: configurationValue.hasText,
          configugrationHasPrice: !configurationValue.isFree,
        };
      })
    );

    // 3. Creazione della richiesta (RequestOfPrev) nel database
    const requestOfPrev = await db.requestOfPrev.create({
      data: {
        personId: personData.personId || null,
        ragioneSociale: personData.ragioneSociale,
        citta: personData.citta,
        codiceFiscale: personData.codiceFiscale,
        partitaIva: personData.partitaIva,
        telefono: personData.telefono,
        email: personData.email,
        variantId: data.variantId, // ID del variant

        // Aggiungi le configurazioni come un array di oggetti
        configurations: configurationsDetails,
      },
    });

    // Emetti un evento per aggiornare la dashboard via Pusher
    await pusher.trigger("dashboard-channel", "page-refresh", null);

    // Revalida la cache della pagina
    revalidatePath("/admin/preventivi");

    // Restituisci la richiesta creata
    return { requestOfPrev };
  } catch (err) {
    console.error("Errore nella creazione della richiesta:", err);
    return { error: "Errore nella creazione della richiesta" };
  }
}
