import HeaderBar from "@/components/admin/header-bar";
import AddValueToConfigurationBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration/add-configuration-value-btn";
import ConfigurationPage from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration/configuration-page";
import ConfigurationValueList from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration/configuration-value-list";
import ConfigurationVisibilityCondition from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration/configuration-visibility-condition";
import DeleteConfigurationBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration/delete-configuration-btn";
import EditConfiguration from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration/edit-configutation";
import { Button } from "@/components/ui/button";
import {
  GetAllConfigurationWithConfigurationChangeByConfigurationId,
  GetAllNodeByVariantId,
  GetConfigurationById,
  GetConfigurationByVariantId,
} from "@/data/trailer";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

async function page({
  params: { trailerId, categoryId, variantId, configurationId },
}: {
  params: {
    trailerId: string;
    categoryId: string;
    variantId: string;
    configurationId: string;
  };
}) {
  return (
    <ConfigurationPage
      categoryId={categoryId}
      configurationId={configurationId}
      trailerId={trailerId}
      variantId={variantId}
    />
  );
}

export default page;
