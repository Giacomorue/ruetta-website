"use client"

import React from "react";
import { Configuration, ConfigurationVisibilityCondition as ConfigurationVisibilityConditionType , Prisma} from "prisma/prisma-client";
import {
  GetConfigurationByVariantId,
  GetConfigurationVisibilityCondition,
} from "@/data/trailer";
import AddConfigurationVisibilityConditionBtn from "./add-configuration-visibility-condtion-btn";
import ViewConfigurationVisibilityCondition from "./view-configuration-visibility-condition";
// import AddVisibilityConditionBtn from "./add-visibility-condition-btn";
// import ViewVisibilityCondition from "./view-visibility-condition";

type configurationType = Prisma.ConfigurationGetPayload<{
  include: { values: true, configurationVisibilityCondition: true };
}>;

function ConfigurationVisibilityCondition({
  configuration,
  variantId,
  allVisibilityCondition,
  editConfigurations,
  onRevalidate,
  socketId
}: {
  configuration: Configuration;
  variantId: string;
  allVisibilityCondition: ConfigurationVisibilityConditionType[];
  editConfigurations: configurationType[],
  socketId: string;
  onRevalidate: () => void;
}) {
  let visibilityCondition = null;

  if (configuration.visibilityConditionId) {
    visibilityCondition = allVisibilityCondition.find((c) => c.id === configuration.visibilityConditionId);
  }

  const allConfiguration = editConfigurations;

  const allConfigurationCanUse = allConfiguration
    ? allConfiguration?.filter((c) => c.id != configuration.id)
    : [];

  return (
    <div className="overflow-x-auto">
      {!visibilityCondition ? (
        <div>
          <p className="text-md text-muted-foreground mb-3">Sempre visibile</p>
          <AddConfigurationVisibilityConditionBtn
            configuration={configuration}
            configurations={allConfigurationCanUse}
            isFirstNode={true}
            parentId={configuration.id}
            isElseRec={false}
            isIfRec={false}
            socketId={socketId}
            onRevalidate={onRevalidate}
          />
        </div>
      ) : (
        <ViewConfigurationVisibilityCondition
          configuration={configuration}
          visibilityConditionId={visibilityCondition.id}
          variantId={variantId}
          configurations={allConfigurationCanUse}
          socketId={socketId}
          onRevalidate={onRevalidate}
          allVisibilityCondition={allVisibilityCondition}
        />
      )}
    </div>
  );
}

export default ConfigurationVisibilityCondition;
