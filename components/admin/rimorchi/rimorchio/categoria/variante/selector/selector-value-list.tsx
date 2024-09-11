"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reorder } from "framer-motion";

import {
  SelectorOption,
  Selector,
  ConfigurationValue,
} from "prisma/prisma-client";
import React, { useEffect, useRef, useState } from "react";
import EditSelectorValueForm from "./edit-selector-value-form";
import { Image as ImageType } from "prisma/prisma-client";
import ChangeSelectorValue from "./change-selector-value";
import { notFound } from "next/navigation";

import { CheckTypeChange } from "prisma/prisma-client";

interface ConfigurationValue2 {
  id: string;
  value: string;
  isFree: boolean;
  prezzo: number | null;
  hasText: boolean;
  text: string | null;
  configurationId: string;
}

// Definisci il tipo per Configuration
interface Configuration2 {
  id: string;
  name: string;
  defaultValue: string | null;
  createdAt: Date;
  updatedAt: Date;
  variantId: string; // Aggiungi questa proprietà se manca
  values: ConfigurationValue2[];
}
// Definisci il tipo per l'array di Configuration o null
type AllConfigurations = Configuration2[] | null;

type SelectorOptionWithChanges = {
  id: string;
  label: string;
  valueOfConfigurationToRefer: string;
  visible: boolean;
  modalDescription: string;
  images: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
  selectorId: string;
  selectorOptionFirstNode: string[]; // Aggiunto il campo mancante
  selectorOptionChange: {
    id: string;
    haveIf: boolean;
    configurationId: string | null;
    checkType: CheckTypeChange;
    expectedValue: string | null;
    parentId: string | null;
    isFirstNode: boolean;
    ifRecId: string[];
    elseRecId: string[];
    createdAt: Date;
    updatedAt: Date;
    selectorOptionId: string;
    change: {
      id: string;
      configurationToChangeId: string;
      newValueValue: string | null;
      selectorOptionChangeId: string | null;
      selectorOptionElseChangeId: string | null;
    }[];
    elseChange: {
      id: string;
      configurationToChangeId: string;
      newValueValue: string | null;
      selectorOptionChangeId: string | null;
      selectorOptionElseChangeId: string | null;
    }[];
  }[];
};

type GetAllSelectorOptionWithSelectorOptionChangeBySelectroIdReturnType =
  SelectorOptionWithChanges[];

function SelectorValueList({
  images,
  selector,
  selectorOption,
  configurationValue,
  allConfigurations,
  allSelectorOptionWithChange,
  socketId,
  onRevalidate,
}: {
  images: ImageType[] | null;
  selector: Selector;
  selectorOption: SelectorOption[];
  configurationValue: ConfigurationValue[];
  allConfigurations: AllConfigurations;
  allSelectorOptionWithChange: GetAllSelectorOptionWithSelectorOptionChangeBySelectroIdReturnType;
  socketId: string;
  onRevalidate: () => void;
}) {
  const [updateCount, setUpdateCount] = useState(0); // Forza il re-render
  const [openItems, setOpenItems] = useState<string[]>([]); // Gestione dei pannelli aperti
  const scrollPositionRef = useRef<number>(0); // Per salvare la posizione di scroll

  // Trova la configurazione corrispondente
  const configuration = allConfigurations?.find(
    (c) => c.id === selector.configurationToRefer
  );

  if (!configuration) {
    notFound();
  }

  const allConfigurationWithoutThis = allConfigurations
    ? allConfigurations.filter((c) => c.id !== configuration.id)
    : [];

  // UseEffect per forzare l'aggiornamento quando le dipendenze cambiano
  useEffect(() => {
    setUpdateCount((prev) => prev + 1); // Forza il re-render

    scrollPositionRef.current = window.scrollY; // Salva la posizione corrente di scroll

    // Aggiorna lo stato degli item aperti
    setOpenItems((prevOpenItems) => {
      return prevOpenItems.filter((openItem) =>
        allSelectorOptionWithChange.some((item) => item.id === openItem)
      );
    });
  }, [
    selectorOption,
    configurationValue,
    allSelectorOptionWithChange,
    allConfigurations,
    selector,
  ]);

  // Ripristina la posizione di scroll dopo l'aggiornamento
  useEffect(() => {
    window.scrollTo(0, scrollPositionRef.current);
  }, [updateCount]);

  // Gestione dell'apertura e chiusura dei pannelli dell'Accordion
  const handleAccordionChange = (id: string) => {
    setOpenItems((prevOpenItems) => {
      if (prevOpenItems.includes(id)) {
        // Se l'item è già aperto, rimuovilo
        return prevOpenItems.filter((item) => item !== id);
      } else {
        // Altrimenti, aggiungilo
        return [...prevOpenItems, id];
      }
    });
  };

  return (
    <Accordion
      type="multiple"
      value={openItems} // Gestiamo qui un array di elementi aperti
      onValueChange={(values) => setOpenItems(values)} // Impostiamo i valori aperti
    >
      {selectorOption.length > 0 ? (
        <>
          {selectorOption.map((v) => {
            const value = allSelectorOptionWithChange.find(
              (va) => va.id === v.id
            );

            if (!value) return null; // Non continuare se value non esiste

            const confName =
              configurationValue.find(
                (v) => v.id === value.valueOfConfigurationToRefer
              )?.value || "";

            if (!v) {
              return null;
            }

            return (
              <AccordionItem key={value.id} value={value.id}>
                <AccordionTrigger
                  className={`text-lg text-neutral-600 ${
                    value.visible === true ? "!no-underline" : "line-through"
                  }`}
                  onClick={() => handleAccordionChange(value.id)} // Gestione click per aprire/chiudere
                >
                  {value.label}
                </AccordionTrigger>
                <AccordionContent>
                  <EditSelectorValueForm
                    images={images}
                    value={value}
                    configurationValueName={confName}
                    socketId={socketId}
                    onRevalidate={onRevalidate}
                  />
                  <ChangeSelectorValue
                    selector={selector}
                    value={v}
                    allConfigurations={allConfigurationWithoutThis}
                    configuration={configuration}
                    allSelectorOptionWithChange={value}
                    socketId={socketId}
                    onRevalidate={onRevalidate}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Non ci sono valori</p>
      )}
    </Accordion>
  );
}

export default SelectorValueList;
