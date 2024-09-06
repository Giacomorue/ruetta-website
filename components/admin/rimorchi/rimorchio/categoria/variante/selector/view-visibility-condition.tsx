import React from "react";
import { Selector } from "prisma/prisma-client";
import { GetVisibilityConditionById } from "@/data/trailer";
import { Separator } from "@/components/ui/separator";
import AddVisibilityConditionBtn from "./add-visibility-condition-btn";
import { FaArrowRight } from "react-icons/fa"; // Importa un'icona
import { BiSolidRightArrow } from "react-icons/bi";
import EditVisibilityConditionBtn from "./edit-visibility-condition-btn";
import DeleteVisibilityConditionBtn from "./delete-visibility-condition-btn";

interface ConfigurationValue {
  id: string;
  value: string;
  isFree: boolean;
  prezzo: number | null;
  hasText: boolean;
  text: string | null;
  configurationId: string;
}

interface Configuration {
  id: string;
  name: string;
  defaultValue: string | null;
  createdAt: Date;
  updatedAt: Date;
  variantId: string;
  values: ConfigurationValue[];
}

type AllConfigurations = Configuration[] | null;

async function ViewVisibilityCondition({
  visibilityConditionId,
  selector,
  variantId,
  configurations,
}: {
  visibilityConditionId: string;
  selector: Selector;
  variantId: string;
  configurations: AllConfigurations;
}) {
  const visibilityCondition = await GetVisibilityConditionById(
    visibilityConditionId
  );

  if (!visibilityCondition) {
    return <p>Errore nel trovare la condizione di visibilità</p>;
  }

  const conf = configurations?.find(
    (c) => c.id === visibilityCondition.configurationId
  );

  const confValue = conf?.values.find(
    (v) => v.id === visibilityCondition.expectedValue
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <BiSolidRightArrow className="text-gray-500" />
        <div className="ml-2">
          Se{" "}
          <span className="mx-2 inline-flex bg-primary text-primary-foreground items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4 py-2 border border-input shadow-sm">
            {conf?.name}
          </span>{" "}
          è{" "}
          <strong>
            {visibilityCondition.checkType === "EQUAL"
              ? "uguale a"
              : "diversa da"}
          </strong>{" "}
          <span className="mx-2 inline-flex bg-primary text-primary-foreground items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4 py-2 border border-input shadow-sm">
            {confValue?.value}
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <EditVisibilityConditionBtn
            configurations={configurations}
            selector={selector}
            visibilityCondition={visibilityCondition}
          />
          <DeleteVisibilityConditionBtn condition={visibilityCondition} />
        </div>
      </div>

      {/* VISUALIZZAZIONE DEL RAMO IF */}
      <div className="pl-7 border-l-4 border-blue-500">
        {visibilityCondition.ifRecId ? (
          <ViewVisibilityCondition
            configurations={configurations}
            selector={selector}
            variantId={variantId}
            visibilityConditionId={visibilityCondition.ifRecId}
          />
        ) : (
          <div>
            <p className="">
              Il selettore è{" "}
              <span className="font-bold">
                {visibilityCondition.ifVisible ? "visibile" : "nascosto"}
              </span>
            </p>
            <div className="my-4 relative w-[200px]">
              <Separator className="w-[200px]" />
              <span className="bg-white text-muted-foreground px-3 py-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">
                Oppure
              </span>
            </div>
            <AddVisibilityConditionBtn
              configurations={configurations}
              isFirstNode={false}
              parentId={visibilityCondition.id}
              isIfRec={true}
              isElseRec={false}
              selector={selector}
            />
          </div>
        )}
      </div>

      <div className="flex items-center">
        <BiSolidRightArrow className="text-gray-500" />
        <p className="ml-2">Altrimenti</p>
      </div>

      {/* VISUALIZZAZIONE DEL RAMO ELSE */}
      <div className="pl-7 border-l-4 border-red-500">
        {visibilityCondition.elseRecId ? (
          <ViewVisibilityCondition
            configurations={configurations}
            selector={selector}
            variantId={variantId}
            visibilityConditionId={visibilityCondition.elseRecId}
          />
        ) : (
          <div>
            <p className="">
              Il selettore è{" "}
              <span className="font-bold">
                {visibilityCondition.elseVisible ? "visibile" : "nascosto"}
              </span>
            </p>
            <div className="my-4 relative w-[200px]">
              <Separator className="w-[200px]" />
              <span className="bg-white text-muted-foreground px-3 py-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">
                Oppure
              </span>
            </div>
            <AddVisibilityConditionBtn
              configurations={configurations}
              isFirstNode={false}
              parentId={visibilityCondition.id}
              isIfRec={false}
              isElseRec={true}
              selector={selector}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewVisibilityCondition;
