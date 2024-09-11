"use client";

import React, { useState } from "react";
import { CheckTypeChange, Node } from "prisma/prisma-client";
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa6";
import NewConfigurationChangeBtn from "./new-configuration-change-btn";
import DeleteConfigurationChangeBtn from "./delete-configuration-change-btn.tsx";
import EditConfigurationChangeBtn from "./edit-configuration-change-btn";
// import DeleteConfigurationChangeBtn from "./delete-configuration-change-btn";
// import EditConfigurationChangeBtn from "./edit-configuration-change-btn";

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

function ViewConfigurationChanges({
  configurationChange,
  allConfigurationChangeOptions,
  allConfigurations,
  allNodes,
  configurationValue,
  isElse,
  onRevalidate,
  socketId,
}: {
  configurationChange: {
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
    configurationValueId: string;
    change: {
      id: string;
      nodeId: string;
      visible: boolean;
      changePosition: boolean;
      changeScale: boolean;
      position: { x: number; y: number; z: number } | null;
      scale: { x: number; y: number; z: number } | null;
    }[];
    elseChange: {
      id: string;
      nodeId: string;
      visible: boolean;
      changePosition: boolean;
      changeScale: boolean;
      position: { x: number; y: number; z: number } | null;
      scale: { x: number; y: number; z: number } | null;
    }[];
  };
  allConfigurationChangeOptions: {
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
    configurationValueId: string;
    change: {
      id: string;
      nodeId: string;
      visible: boolean;
      changePosition: boolean;
      changeScale: boolean;
      position: { x: number; y: number; z: number } | null;
      scale: { x: number; y: number; z: number } | null;
    }[];
    elseChange: {
      id: string;
      nodeId: string;
      visible: boolean;
      changePosition: boolean;
      changeScale: boolean;
      position: { x: number; y: number; z: number } | null;
      scale: { x: number; y: number; z: number } | null;
    }[];
  }[];
  allConfigurations: AllConfigurations;
  allNodes: Node[];
  configurationValue: ConfigurationValue2;
  isElse: boolean;
  socketId: string;
  onRevalidate: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isElseExpanded, setIsElseExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleElseExpand = () => {
    setIsElseExpanded(!isElseExpanded);
  };

  const conf = allConfigurations?.find(
    (c) => c.id === configurationChange.configurationId
  );

  const confValue = conf?.values.find(
    (v) => v.id === configurationChange.expectedValue
  );

  const hasConfigurations = allConfigurations && allConfigurations.length > 0;

  const isDisabled = !hasConfigurations;

  return (
    <div className="space-y-4 mb-6">
      {configurationChange.haveIf ? (
        <div>
          <div className="flex items-center cursor-pointer">
            <div
              className="mr-4 flex flex-row items-center"
              onClick={toggleExpand}
            >
              <div className="mr-2">
                {isExpanded ? (
                  <BiSolidDownArrow className="text-gray-500" />
                ) : (
                  <BiSolidRightArrow className="text-gray-500" />
                )}
              </div>
              <div>
                Se{" "}
                <span className="mx-2 inline-flex bg-primary text-primary-foreground items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4 py-2 border border-input shadow-sm">
                  {conf?.name}
                </span>{" "}
                è{" "}
                <strong>
                  {configurationChange.checkType === "EQUAL"
                    ? "uguale a"
                    : "diversa da"}
                </strong>{" "}
                <span className="mx-2 inline-flex bg-primary text-primary-foreground items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4 py-2 border border-input shadow-sm">
                  {confValue?.value}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <EditConfigurationChangeBtn
                configurationChange={configurationChange}
                configurations={allConfigurations}
                nodes={allNodes}
                configurationValue={configurationValue}
                socketId={socketId}
                onRevalidate={onRevalidate}
              />
              <DeleteConfigurationChangeBtn
                change={configurationChange}
                socketId={socketId}
                onRevalidate={onRevalidate}
              />
            </div>
          </div>

          {isExpanded && (
            <div className="pl-7 border-l-4 border-blue-500 my-4">
              <div className="my-4">
                {configurationChange.change.map((change) => {
                  const node = allNodes.find((n) => n.id === change.nodeId);
                  return (
                    <p key={change.id} className="my-2">
                      Il nodo <span className="font-bold">{node?.name}</span>{" "}
                      sarà{" "}
                      <span className="font-bold">
                        {change.visible ? "visibile" : "nascosto"}
                      </span>
                      {change.changePosition && change.position && (
                        <span>
                          , con posizione X: {change.position.x}, Y:{" "}
                          {change.position.y}, Z: {change.position.z}
                        </span>
                      )}
                      {change.changeScale && change.scale && (
                        <span>
                          , con scala X: {change.scale.x}, Y: {change.scale.y},
                          Z: {change.scale.z}
                        </span>
                      )}
                    </p>
                  );
                })}
              </div>
              {configurationChange.ifRecId &&
                configurationChange.ifRecId.length > 0 && (
                  <div>
                    {configurationChange.ifRecId.map((id) => {
                      const subChange = allConfigurationChangeOptions.find(
                        (a) => a.id === id
                      );

                      if (!subChange) {
                        return null;
                      }

                      return (
                        <ViewConfigurationChanges
                          key={id}
                          configurationChange={subChange}
                          allConfigurations={allConfigurations}
                          allNodes={allNodes}
                          allConfigurationChangeOptions={
                            allConfigurationChangeOptions
                          }
                          configurationValue={configurationValue}
                          isElse={isElse}
                          socketId={socketId}
                          onRevalidate={onRevalidate}
                        />
                      );
                    })}
                  </div>
                )}
              <div className="my-4">
                {isDisabled ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          className="gap-x-2"
                          variant={"outline"}
                          disabled
                        >
                          <FaPlus className="w-4 h-4" />
                          <span>Aggiungi cambiamento</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={16}>
                        <p>
                          Per aggiungere un cambiamento, assicurati che ci siano
                          dei nodi configurabili
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <NewConfigurationChangeBtn
                    configurations={allConfigurations}
                    nodes={allNodes}
                    isFirstNode={false}
                    isIfRec={true}
                    isElseRec={false}
                    parentId={configurationChange.id}
                    configurationValue={configurationValue}
                    isElse={isElse}
                    socketId={socketId}
                    onRevalidate={onRevalidate}
                  />
                )}
              </div>
            </div>
          )}

          <div
            className="flex items-center cursor-pointer"
            onClick={toggleElseExpand}
          >
            {isElseExpanded ? (
              <BiSolidDownArrow className="text-gray-500" />
            ) : (
              <BiSolidRightArrow className="text-gray-500" />
            )}
            <p className="ml-2">Altrimenti</p>
          </div>

          {isElseExpanded && (
            <div className="pl-7 border-l-4 border-red-500 my-4">
              <div className="my-4">
                {configurationChange.elseChange.map((change) => {
                  const node = allNodes.find((n) => n.id === change.nodeId);
                  return (
                    <p key={change.id} className="my-2">
                      Il nodo <span className="font-bold">{node?.name}</span>{" "}
                      sarà{" "}
                      <span className="font-bold">
                        {change.visible ? "visibile" : "nascosto"}
                      </span>
                      {change.changePosition && change.position && (
                        <span>
                          , con posizione X: {change.position.x}, Y:{" "}
                          {change.position.y}, Z: {change.position.z}
                        </span>
                      )}
                      {change.changeScale && change.scale && (
                        <span>
                          , con scala X: {change.scale.x}, Y: {change.scale.y},
                          Z: {change.scale.z}
                        </span>
                      )}
                    </p>
                  );
                })}
                {configurationChange.elseRecId &&
                  configurationChange.elseRecId.length > 0 && (
                    <div>
                      {configurationChange.elseRecId.map((id) => {
                        const subChange = allConfigurationChangeOptions.find(
                          (a) => a.id === id
                        );

                        if (!subChange) {
                          return null;
                        }

                        return (
                          <ViewConfigurationChanges
                            key={id}
                            configurationChange={subChange}
                            allConfigurations={allConfigurations}
                            allNodes={allNodes}
                            allConfigurationChangeOptions={
                              allConfigurationChangeOptions
                            }
                            configurationValue={configurationValue}
                            isElse={isElse}
                            socketId={socketId}
                            onRevalidate={onRevalidate}
                          />
                        );
                      })}
                    </div>
                  )}
                <div className="my-4">
                  {isDisabled ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            className="gap-x-2"
                            variant={"outline"}
                            disabled
                          >
                            <FaPlus className="w-4 h-4" />
                            <span>Aggiungi cambiamento</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={16}>
                          <p>
                            Per aggiungere un cambiamento, assicurati che ci
                            siano dei nodi configurabili
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <NewConfigurationChangeBtn
                      configurations={allConfigurations}
                      nodes={allNodes}
                      isFirstNode={false}
                      isIfRec={false}
                      isElseRec={true}
                      parentId={configurationChange.id}
                      configurationValue={configurationValue}
                      isElse={isElse}
                      socketId={socketId}
                      onRevalidate={onRevalidate}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="">
          <div className="flex items-center cursor-pointer">
            <div className="flex flex-row items-center" onClick={toggleExpand}>
              {isExpanded ? (
                <BiSolidDownArrow className="text-gray-500" />
              ) : (
                <BiSolidRightArrow className="text-gray-500" />
              )}
              <p className="ml-2 mr-4">Cambiamenti senza condizione</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <EditConfigurationChangeBtn
                configurationChange={configurationChange}
                configurations={allConfigurations}
                nodes={allNodes}
                configurationValue={configurationValue}
                socketId={socketId}
                onRevalidate={onRevalidate}
              />
              <DeleteConfigurationChangeBtn
                change={configurationChange}
                socketId={socketId}
                onRevalidate={onRevalidate}
              />
            </div>
          </div>

          <div className="pl-7 border-l-4 border-blue-500 mb-4 mt-2">
            {isExpanded && (
              <div>
                {configurationChange.change.map((change) => {
                  const node = allNodes.find((n) => n.id === change.nodeId);
                  return (
                    <p key={change.id} className="my-4">
                      Il nodo <span className="font-bold">{node?.name}</span>{" "}
                      sarà{" "}
                      <span className="font-bold">
                        {change.visible ? "visibile" : "nascosto"}
                      </span>
                      {change.changePosition && change.position && (
                        <span>
                          , con posizione X: {change.position.x}, Y:{" "}
                          {change.position.y}, Z: {change.position.z}
                        </span>
                      )}
                      {change.changeScale && change.scale && (
                        <span>
                          , con scala X: {change.scale.x}, Y: {change.scale.y},
                          Z: {change.scale.z}
                        </span>
                      )}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewConfigurationChanges;
