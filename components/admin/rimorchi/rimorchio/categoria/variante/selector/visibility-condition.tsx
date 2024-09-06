import React from "react";
import { Selector } from "prisma/prisma-client";
import {
  GetConfigurationByVariantId,
  GetVisibilityConditionById,
} from "@/data/trailer";
import AddVisibilityConditionBtn from "./add-visibility-condition-btn";
import ViewVisibilityCondition from "./view-visibility-condition";

async function VisibilityCondition({
  selector,
  variantId,
}: {
  selector: Selector;
  variantId: string;
}) {
  let visibilityCondition = null;

  if (selector.visibilityConditionId) {
    visibilityCondition = await GetVisibilityConditionById(
      selector.visibilityConditionId
    );
  }

  const allConfiguration = await GetConfigurationByVariantId(variantId);

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
          />
        </div>
      ) : (
        <ViewVisibilityCondition
          selector={selector}
          visibilityConditionId={visibilityCondition.id}
          variantId={variantId}
          configurations={allConfigurationCanUse}
        />
      )}
    </div>
  );
}

export default VisibilityCondition;
