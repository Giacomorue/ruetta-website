import React from "react";
import { Configuration } from "prisma/prisma-client";
import {
  GetConfigurationByVariantId,
  GetConfigurationVisibilityCondition,
} from "@/data/trailer";
import AddConfigurationVisibilityConditionBtn from "./add-configuration-visibility-condtion-btn";
import ViewConfigurationVisibilityCondition from "./view-configuration-visibility-condition";
// import AddVisibilityConditionBtn from "./add-visibility-condition-btn";
// import ViewVisibilityCondition from "./view-visibility-condition";

async function ConfigurationVisibilityCondition({
  configuration,
  variantId,
}: {
  configuration: Configuration;
  variantId: string;
}) {
  let visibilityCondition = null;

  if (configuration.visibilityConditionId) {
    visibilityCondition = await GetConfigurationVisibilityCondition(
      configuration.visibilityConditionId
    );
  }

  const allConfiguration = await GetConfigurationByVariantId(variantId);

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
          />
        </div>
      ) : (
        <ViewConfigurationVisibilityCondition
          configuration={configuration}
          visibilityConditionId={visibilityCondition.id}
          variantId={variantId}
          configurations={allConfigurationCanUse}
        />
      )}
    </div>
  );
}

export default ConfigurationVisibilityCondition;
