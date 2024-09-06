"use client";

import React, { useState } from "react";
import {
  SelectorOptionChange,
  SelectorOption,
  CheckTypeChange,
} from "prisma/prisma-client";
import { Separator } from "@/components/ui/separator";
import NewSelectorChangeBtn from "./new-selector-change-btn";
import DeleteSelectorOptionChangeBtn from "./delete-selector-option-change";
import EditSelectorChangeBtn from "./edit-selector-option-change"; // Importa il bottone di modifica
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";

interface ConfigurationValue2 {
  id: string;
  value: string;
  isFree: boolean;
  prezzo: number | null;
  hasText: boolean;
  text: string | null;
  configurationId: string;
}

interface Configuration2 {
  id: string;
  name: string;
  defaultValue: string | null;
  createdAt: Date;
  updatedAt: Date;
  variantId: string;
  values: ConfigurationValue2[];
}

type AllConfigurations = Configuration2[] | null;

function ViewSelectorChanges({
  selectorOption,
  allSelectorChangeOptions,
  allConfigurations,
  selectorChange,
}: {
  selectorChange: {
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
  };
  allSelectorChangeOptions: {
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
  selectorOption: SelectorOption;
  allConfigurations: AllConfigurations;
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
    (c) => c.id === selectorChange.configurationId
  );

  const confValue = conf?.values.find(
    (v) => v.id === selectorChange.expectedValue
  );

  const hasConfigurations = allConfigurations && allConfigurations.length > 0;

  const isDisabled = !hasConfigurations;

  return (
    <div className="space-y-4 mb-6">
      {selectorChange.haveIf ? (
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
                  {selectorChange.checkType === "EQUAL"
                    ? "uguale a"
                    : "diversa da"}
                </strong>{" "}
                <span className="mx-2 inline-flex bg-primary text-primary-foreground items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4 py-2 border border-input shadow-sm">
                  {confValue?.value}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <EditSelectorChangeBtn
                selectorOptionChange={selectorChange}
                configurations={allConfigurations}
              />{" "}
              <DeleteSelectorOptionChangeBtn change={selectorChange} />
            </div>
          </div>

          {isExpanded && (
            <div className="pl-7 border-l-4 border-blue-500 my-4">
              <div className="my-4">
                {selectorChange.change.map((selectorChange) => {
                  const c = allConfigurations?.find(
                    (a) => a.id === selectorChange.configurationToChangeId
                  );
                  const value = c?.values.find(
                    (v) => v.id === selectorChange.newValueValue
                  );

                  return (
                    <p key={selectorChange.id}>
                      La configurazione{" "}
                      <span className="font-bold">{c?.name}</span> assumerà il
                      valore <span className="font-bold">{value?.value}</span>
                    </p>
                  );
                })}
              </div>
              {selectorChange.ifRecId && selectorChange.ifRecId.length > 0 && (
                <div>
                  {selectorChange.ifRecId.map((id) => {
                    const selectorChange = allSelectorChangeOptions.find(
                      (a) => a.id === id
                    );

                    if (!selectorChange) {
                      return null;
                    }

                    return (
                      <ViewSelectorChanges
                        key={id}
                        selectorChange={selectorChange}
                        selectorOption={selectorOption}
                        allConfigurations={allConfigurations}
                        allSelectorChangeOptions={allSelectorChangeOptions}
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
                          delle configurazioni oltre a quella associata a questo
                          selettore
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <NewSelectorChangeBtn
                    configurations={allConfigurations}
                    isFirstNode={false}
                    isIfRec={true}
                    isElseRec={false}
                    parentId={selectorChange.id}
                    selectorOption={selectorOption}
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
                {selectorChange.elseChange.map((selectorChange) => {
                  const c = allConfigurations?.find(
                    (a) => a.id === selectorChange.configurationToChangeId
                  );
                  const value = c?.values.find(
                    (v) => v.id === selectorChange.newValueValue
                  );

                  return (
                    <p key={selectorChange.id}>
                      La configurazione{" "}
                      <span className="font-bold">{c?.name}</span> assumerà il
                      valore <span className="font-bold">{value?.value}</span>
                    </p>
                  );
                })}
                {selectorChange.elseRecId &&
                  selectorChange.elseRecId.length > 0 && (
                    <div>
                      {selectorChange.elseRecId.map((id) => {
                        const selectorChange = allSelectorChangeOptions.find(
                          (a) => a.id === id
                        );

                        if (!selectorChange) {
                          return null;
                        }

                        return (
                          <ViewSelectorChanges
                            key={id}
                            selectorChange={selectorChange}
                            selectorOption={selectorOption}
                            allConfigurations={allConfigurations}
                            allSelectorChangeOptions={allSelectorChangeOptions}
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
                            siano delle configurazioni oltre a quella associata
                            a questo selettore
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <NewSelectorChangeBtn
                      configurations={allConfigurations}
                      isFirstNode={false}
                      isIfRec={false}
                      isElseRec={true}
                      parentId={selectorChange.id}
                      selectorOption={selectorOption}
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
              <EditSelectorChangeBtn
                selectorOptionChange={selectorChange}
                configurations={allConfigurations}
              />{" "}
              <DeleteSelectorOptionChangeBtn change={selectorChange} />
            </div>
          </div>

          <div className="pl-7 border-l-4 border-blue-500 mb-4 mt-2">
            {isExpanded && (
              <div>
                {selectorChange.change.map((selectorChange) => {
                  const c = allConfigurations?.find(
                    (a) => a.id === selectorChange.configurationToChangeId
                  );
                  const value = c?.values.find(
                    (v) => v.id === selectorChange.newValueValue
                  );
                  return (
                    <p key={selectorChange.id} className="my-4">
                      La configurazione{" "}
                      <span className="font-bold">{c?.name}</span> assumerà il
                      valore <span className="font-bold">{value?.value}</span>
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

export default ViewSelectorChanges;
