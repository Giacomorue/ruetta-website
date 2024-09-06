import HeaderBar from "@/components/admin/header-bar";
import AddValueToConfigurationBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration/add-configuration-value-btn";
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
  const configuration = await GetConfigurationById(configurationId);

  if (!configuration) {
    notFound();
  }

  if (configuration.variantId !== variantId) {
    notFound();
  }

  const allNode = await GetAllNodeByVariantId(variantId);

  const editConfigurations = await GetConfigurationByVariantId(variantId);

  const allConfigurationWithoutThis = editConfigurations
    ? editConfigurations?.filter((c) => c.id !== configuration.id)
    : [];

  const allConfigurationWithConfigurationChange =
    await GetAllConfigurationWithConfigurationChangeByConfigurationId(
      configurationId
    );

  const allConfigurationWithConfigurationChangeForParam =
    allConfigurationWithConfigurationChange.map((value) => ({
      ...value,
      configurationChange: value.configurationChange.map((change) => ({
        ...change,
        change: change.change.map((action) => ({
          ...action,
          position: action.position
            ? {
                x: action.position.x ?? 0, // Assicura che x sia un numero
                y: action.position.y ?? 0, // Assicura che y sia un numero
                z: action.position.z ?? 0, // Assicura che z sia un numero
              }
            : null,
          scale: action.scale
            ? {
                x: action.scale.x ?? 0, // Assicura che x sia un numero
                y: action.scale.y ?? 0, // Assicura che y sia un numero
                z: action.scale.z ?? 0, // Assicura che z sia un numero
              }
            : null,
        })),
        elseChange: change.elseChange.map((action) => ({
          ...action,
          position: action.position
            ? {
                x: action.position.x ?? 0, // Assicura che x sia un numero
                y: action.position.y ?? 0, // Assicura che y sia un numero
                z: action.position.z ?? 0, // Assicura che z sia un numero
              }
            : null,
          scale: action.scale
            ? {
                x: action.scale.x ?? 0, // Assicura che x sia un numero
                y: action.scale.y ?? 0, // Assicura che y sia un numero
                z: action.scale.z ?? 0, // Assicura che z sia un numero
              }
            : null,
        })),
      })),
    }));

  return (
    <div>
      <HeaderBar
        title={"Configurazione " + configuration.name}
        possibleBackButton={
          <>
            <Button variant={"ghost"}>
              <Link
                href={
                  "/admin/rimorchi/" +
                  trailerId +
                  "/" +
                  categoryId +
                  "/" +
                  variantId
                }
              >
                <IoArrowBack className="w-6 h-6" />
              </Link>
            </Button>
          </>
        }
      >
        <DeleteConfigurationBtn
          configuration={configuration}
          trailerId={trailerId}
          categoryId={categoryId}
          variantId={variantId}
        />
      </HeaderBar>

      <AddValueToConfigurationBtn
        configuration={configuration}
        trailerId={trailerId}
        categoryId={categoryId}
        variantId={variantId}
      />
      <ConfigurationValueList
        values={configuration.values}
        configuration={configuration}
        allConfigurationWithConfigurationChange={
          allConfigurationWithConfigurationChangeForParam
        }
        allConfigurations={allConfigurationWithoutThis}
        allNode={allNode ? allNode : []}
      />
      <div className="my-6"></div>
      <EditConfiguration
        configuration={configuration}
        values={configuration.values}
      />
      <HeaderBar title="Condizioni di visibilità sul preventivo" subtitle />
      <ConfigurationVisibilityCondition
        configuration={configuration}
        variantId={variantId}
      />
    </div>
  );
}

export default page;
