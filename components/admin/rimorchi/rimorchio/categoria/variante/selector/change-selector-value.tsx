"use client";

import React from "react";

import { Selector, SelectorOption } from "prisma/prisma-client";
import HeaderBar from "@/components/admin/header-bar";
import NewSelectorChangeBtn from "./selector-change/new-selector-change-btn";
import ViewSelectorChanges from "./selector-change/view-selector-change";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

import { CheckTypeChange } from "prisma/prisma-client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

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

function ChangeSelectorValue({
  selector,
  allConfigurations,
  configuration,
  value,
  allSelectorOptionWithChange,
}: {
  selector: Selector;
  allConfigurations: AllConfigurations;
  configuration: Configuration2;
  value: SelectorOption;
  allSelectorOptionWithChange: SelectorOptionWithChanges;
}) {
  const hasConfigurations = allConfigurations && allConfigurations.length > 0;

  const isDisabled = !hasConfigurations;

  return (
    <div className="px-4 py-2">
      <HeaderBar title={"Cambiamenti del valore " + value.label} subtitle />
      <p className="text-md text-muted-foreground mb-3">
        Il cambiamento principale che fa è impostare la configurazione{" "}
        {configuration.name} al valore {value.label}
      </p>

      {/* Visualizza i cambiamenti già inseriti */}
      {value.selectorOptionFirstNode.map((firstNode) => {
        const selectorChange =
          allSelectorOptionWithChange.selectorOptionChange.find(
            (c) => c.id === firstNode
          );

        if (!selectorChange) {
          return null;
        }

        return (
          <ViewSelectorChanges
            key={firstNode}
            selectorChange={selectorChange}
            selectorOption={value}
            allConfigurations={allConfigurations}
            allSelectorChangeOptions={
              allSelectorOptionWithChange.selectorOptionChange
            }
          />
        );
      })}

      {isDisabled ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="gap-x-2" variant={"outline"} disabled>
                <FaPlus className="w-4 h-4" />
                <span>Aggiungi cambiamento</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={16}>
              <p>
                Per aggiungere un cambiamento, assicurati che ci siano delle
                configurazioni oltre a quella associata a questo selettore
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <NewSelectorChangeBtn
          configurations={allConfigurations}
          isFirstNode={true}
          isIfRec={false}
          isElseRec={false}
          parentId={value.id}
          selectorOption={value}
        />
      )}
    </div>
  );
}

export default ChangeSelectorValue;
