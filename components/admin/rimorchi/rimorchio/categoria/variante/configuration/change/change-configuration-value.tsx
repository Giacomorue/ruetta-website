"use client";

import React from "react";

import { Selector, SelectorOption } from "prisma/prisma-client";
import HeaderBar from "@/components/admin/header-bar";
import { Node } from "prisma/prisma-client";

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
  textBig: string | null;
  textLittle: string | null;
  configurationId: string;
}

// Definisci il tipo per Configuration
interface Configuration2 {
  id: string;
  name: string;
  defaultValue: string | null;
  defaultValuePreventivo: string | null;
  createdAt: Date;
  updatedAt: Date;
  variantId: string; // Aggiungi questa proprietà se manca
  values: ConfigurationValue2[];
}


// Definisci il tipo per l'array di Configuration o null
type AllConfigurations = Configuration2[] | null;

import { CheckTypeChange, Configuration } from "prisma/prisma-client";
import NewConfigurationChangeBtn from "./new-configuration-change-btn";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import ViewConfigurationChanges from "./view-configuration-cange";

type GetAllConfigurationWithConfigurationChangeByConfigurationIdReturnType = {
  id: string;
  value: string;
  isFree: boolean;
  prezzo: number | null;
  hasText: boolean;
  textBig: string | null;
  textLittle: string | null;
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
};

function ChangeConfigurationValue({
  allConfigurations,
  configuration,
  value,
  allNode,
  socketId,
  onRevalidate,
}: {
  allConfigurations: AllConfigurations;
  configuration: Configuration;
  value: GetAllConfigurationWithConfigurationChangeByConfigurationIdReturnType;
  allNode: Node[];
  socketId: string;
  onRevalidate: () => void;
}) {
  const hasNodes = allNode && allNode.length > 0;

  const isDisabled = !hasNodes;

  return (
    <div className="px-4 py-2">
      <HeaderBar title={"Cambiamenti del valore " + value.value} subtitle />
      <p className="text-md text-muted-foreground mb-3">
        Inserisci qua tutti i cambiamenti ai nodi che deve effettuare questo
        valore
      </p>

      <div className="px-2">
        <HeaderBar title={"Cambiamenti quando attiva"} subtitle />

        {/* Visualizza i cambiamenti già inseriti */}
        {value.configurationChangeFirstNode.map((firstNode) => {
          const configurationChange = value.configurationChange.find(
            (c) => c.id === firstNode
          );

          if (!configurationChange) {
            return null;
          }

          return (
            <ViewConfigurationChanges
              key={firstNode}
              configurationChange={configurationChange}
              allConfigurations={allConfigurations}
              allNodes={allNode}
              allConfigurationChangeOptions={value.configurationChange}
              configurationValue={value}
              isElse={false}
              socketId={socketId}
              onRevalidate={onRevalidate}
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
                  Per aggiungere un cambiamento, assicurati che ci siano almeno
                  dei nodi disponibili.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <NewConfigurationChangeBtn
            configurations={allConfigurations}
            isFirstNode={true}
            isIfRec={false}
            isElseRec={false}
            parentId={value.id}
            nodes={allNode}
            configurationValue={value}
            isElse={false}
            socketId={socketId}
            onRevalidate={onRevalidate}
          />
        )}
      </div>

      <div className="px-2">
        <HeaderBar title={"Cambiamenti quando non attiva"} subtitle />

        {/* Visualizza i cambiamenti già inseriti */}
        {value.configurationElseChangeFirstNode.map((firstNode) => {
          const configurationChange = value.configurationChange.find(
            (c) => c.id === firstNode
          );

          if (!configurationChange) {
            return null;
          }

          return (
            <ViewConfigurationChanges
              key={firstNode}
              configurationChange={configurationChange}
              allConfigurations={allConfigurations}
              allNodes={allNode}
              allConfigurationChangeOptions={value.configurationChange}
              configurationValue={value}
              isElse={true}
              socketId={socketId}
              onRevalidate={onRevalidate}
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
                  Per aggiungere un cambiamento, assicurati che ci siano almeno
                  dei nodi disponibili.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <NewConfigurationChangeBtn
            configurations={allConfigurations}
            isFirstNode={true}
            isIfRec={false}
            isElseRec={false}
            parentId={value.id}
            nodes={allNode}
            configurationValue={value}
            isElse={true}
            socketId={socketId}
            onRevalidate={onRevalidate}
          />
        )}
      </div>
    </div>
  );
}

export default ChangeConfigurationValue;
