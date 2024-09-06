"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ConfigurationValue, Configuration, Node } from "prisma/prisma-client";
import React from "react";
import EditValueForm from "./edit-value-form";
import ChangeConfigurationValue from "./change/change-configuration-value";

type GetAllConfigurationWithConfigurationChangeByConfigurationIdReturnType =
  Array<{
    id: string;
    value: string;
    isFree: boolean;
    prezzo: number | null;
    hasText: boolean;
    text: string | null;
    configurationId: string;
    configurationChangeFirstNode: string[];
    configurationElseChangeFirstNode: string[];

    configurationChange: Array<{
      id: string;
      haveIf: boolean;
      configurationId: string | null;
      checkType: "EQUAL" | "NOTEQUAL";
      expectedValue: string | null;
      parentId: string | null;
      isFirstNode: boolean;
      ifRecId: string[];
      elseRecId: string[];
      createdAt: Date;
      updatedAt: Date;
      configurationValueId: string;

      change: Array<{
        id: string;
        nodeId: string;
        visible: boolean;
        changePosition: boolean;
        changeScale: boolean;
        position: {
          x: number;
          y: number;
          z: number;
        } | null;
        scale: {
          x: number;
          y: number;
          z: number;
        } | null;
      }>;

      elseChange: Array<{
        id: string;
        nodeId: string;
        visible: boolean;
        changePosition: boolean;
        changeScale: boolean;
        position: {
          x: number;
          y: number;
          z: number;
        } | null;
        scale: {
          x: number;
          y: number;
          z: number;
        } | null;
      }>;
    }>;
  }>;

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

function ConfigurationValueList({
  values,
  configuration,
  allConfigurationWithConfigurationChange,
  allConfigurations,
  allNode,
}: {
  values: ConfigurationValue[];
  configuration: Configuration;
  allConfigurationWithConfigurationChange: GetAllConfigurationWithConfigurationChangeByConfigurationIdReturnType;
  allConfigurations: AllConfigurations;
  allNode: Node[];
}) {
  return (
    <Accordion type="multiple">
      {allConfigurationWithConfigurationChange.map((value) => (
        <AccordionItem key={value.id} value={value.id}>
          <AccordionTrigger className="text-lg text-neutral-600">
            {value.value}
          </AccordionTrigger>
          <AccordionContent>
            <EditValueForm
              value={{
                id: value.id,
                value: value.value,
                configurationId: value.configurationId,
                configurationChangeFirstNode:
                  value.configurationChangeFirstNode,
                hasText: value.hasText,
                isFree: value.isFree,
                prezzo: value.prezzo,
                text: value.text,
                configurationElseChangeFirstNode: value.configurationElseChangeFirstNode,
              }}
              isDefault={value.id === configuration.defaultValue}
            />

            <ChangeConfigurationValue
              value={value}
              allConfigurations={allConfigurations}
              allNode={allNode}
              configuration={configuration}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default ConfigurationValueList;
