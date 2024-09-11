"use client";

import React from "react";
import { Selector } from "prisma/prisma-client";
import {
  GetConfigurationByVariantId,
  GetVisibilityConditionById,
} from "@/data/trailer";
import AddVisibilityConditionBtn from "./add-visibility-condition-btn";
import ViewVisibilityCondition from "./view-visibility-condition";

import { SelectorVisibilityCondition, Prisma } from "prisma/prisma-client";

type configurationType = Prisma.ConfigurationGetPayload<{
  include: { values: true };
}>;

function VisibilityCondition({
  selector,
  variantId,
  allConfiguration,
  visibilityConditions,
  onRevalidate,
  socketId,
}: {
  selector: Selector;
  variantId: string;
  allConfiguration: configurationType[];
  visibilityConditions: SelectorVisibilityCondition[];
  socketId: string;
  onRevalidate: () => void;
}) {
  let visibilityCondition = null;

  if (selector.visibilityConditionId) {
    visibilityCondition = visibilityConditions.find(
      (c) => c.id === selector.visibilityConditionId
    );
  }

  const allConfigurationCanUse = allConfiguration
    ? allConfiguration?.filter((c) => c.id != selector.configurationToRefer)
    : [];

  return (
    <div className="overflow-x-auto">
      {!visibilityCondition ? (
        <div>
          <p className="text-md text-muted-foreground mb-3">Sempre visibile</p>
          <AddVisibilityConditionBtn
            selector={selector}
            configurations={allConfigurationCanUse}
            isFirstNode={true}
            parentId={selector.id}
            isElseRec={false}
            isIfRec={false}
            socketId={socketId}
            onRevalidate={onRevalidate}
          />
        </div>
      ) : (
        <ViewVisibilityCondition
          selector={selector}
          visibilityConditionId={visibilityCondition.id}
          variantId={variantId}
          configurations={allConfigurationCanUse}
          socketId={socketId}
          onRevalidate={onRevalidate}
          visibilityConditions={visibilityConditions}
        />
      )}
    </div>
  );
}

export default VisibilityCondition;
