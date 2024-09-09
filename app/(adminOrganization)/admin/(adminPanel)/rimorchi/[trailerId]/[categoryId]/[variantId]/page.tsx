import { DataTable } from "@/components/admin/data-table";
import HeaderBar from "@/components/admin/header-bar";
import { ColorColumnSchema } from "@/components/admin/rimorchi/rimorchio/categoria/variante/color-column";
import { AllColorDataTable } from "@/components/admin/rimorchi/rimorchio/categoria/variante/color-data-table";
import { ConfigurationColumnSchema } from "@/components/admin/rimorchi/rimorchio/categoria/variante/configuration-column";
import { ConfigurationsDataTable } from "@/components/admin/rimorchi/rimorchio/categoria/variante/configurations-data-table";
import DeleteVariantBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/delete-variante-btn";
import EditVariant from "@/components/admin/rimorchi/rimorchio/categoria/variante/edit-variant";
import NewColorBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/new-color-btn";
import NewConfiguration from "@/components/admin/rimorchi/rimorchio/categoria/variante/new-configuration-btn";
import NewNodeBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/new-node-btn";
import NewSelectorBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/new-selector-btn";
import { NodeColumnSchema } from "@/components/admin/rimorchi/rimorchio/categoria/variante/node-column";
import { NodeDataTable } from "@/components/admin/rimorchi/rimorchio/categoria/variante/node-data-table";
import { SelectorColumnSchema } from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector-column";
import { AllSelectorDataTable } from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector-data-table";
import { Button } from "@/components/ui/button";
import { GetAllImages } from "@/data/images";
import {
  GetAllColorByVariantId,
  GetAllSelectorByVariantId,
  GetConfigurationByVariantId,
  GetConfigurationValueById,
  GetNodesByVariantId,
  GetVariantyById,
} from "@/data/trailer";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { FaEye } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";

async function page({
  params: { trailerId, categoryId, variantId },
}: {
  params: { trailerId: string; categoryId: string; variantId: string };
}) {
  
  const [variant, images, allConfiguration, allSelector, allNode, allColor] = await Promise.all([
    GetVariantyById(variantId),
    GetAllImages(),
    GetConfigurationByVariantId(variantId),
    GetAllSelectorByVariantId(variantId),
    GetNodesByVariantId(variantId),
    GetAllColorByVariantId(variantId),
  ]);

  if (!variant) {
    notFound();
  }

  // const images = await GetAllImages();

  // const allConfiguration = await GetConfigurationByVariantId(variantId);

  const allConfigurationsForTable = allConfiguration
    ? allConfiguration.map((config) => ({
        id: config.id,
        name: config.name,
        defaultValue:
          config.values.find((v) => v.id === config.defaultValue)?.value ||
          config.defaultValue,
        variantId: config.variantId,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
        order: config.order,
      }))
    : [];

  // const allSelector = await GetAllSelectorByVariantId(variantId);

  const allSelectorForTable = allSelector
    ? allSelector.map((selector) => ({
        id: selector.id,
        name: selector.name,
        configurationToRefer:
          allConfiguration?.find((c) => c.id === selector.configurationToRefer)
            ?.name || selector.configurationToRefer,
        visible: selector.visible,
        nOption: selector.options.length,
        createdAt: selector.createdAt,
        updatedAt: selector.updatedAt,
        order: selector.order,
      }))
    : [];

  const selectorVisible = allSelector
    ? allSelector.filter((f) => f.visible === true).length > 0
    : false;

  // const allNode = await GetNodesByVariantId(variantId);

  const allNodeForTable = allNode
    ? allNode.map((node) => ({
        id: node.id,
        name: node.name,
        alwaysHidden: node.alwaysHidden,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        variantId: node.variantId,
      }))
    : [];

  // const allColor = await GetAllColorByVariantId(variantId);

  const allColorForTable = allColor.map((color) => ({
    id: color.id,
    name: color.name,
    description: color.description || "",
    price: color.price || undefined,
    fileUrl: color.fileUrl || "",
    visible: color.visible,
    has3DModel: color.has3DModel,
    colorCodePrincipal: color.colorCodePrincipal,
    images: color.images || [],
    createdAt: new Date(color.createdAt),
    updatedAt: new Date(color.updatedAt),
    variantId: color.variantId,
    order: color.order,
    hasSecondaryColor: color.hasSecondaryColor,
    colorCodeSecondary: color.colorCodeSecondary || "",
  }));

  const has3DModelColor = allColor.some((color) => color.has3DModel);

  return (
    <div>
      <HeaderBar
        title={"Variante " + variant?.name}
        possibleBackButton={
          <>
            <Button variant={"ghost"}>
              <Link href={"/admin/rimorchi/" + trailerId + "/" + categoryId}>
                <IoArrowBack className="w-6 h-6" />
              </Link>
            </Button>
          </>
        }
      >
        <div className="flex flex-row items-center gap-x-2">
          {selectorVisible && (
            <Button variant={"default"} asChild className="gap-x-2">
              <Link href={"/admin/preview/" + variant.accessibleUUID}>
                <FaEye /> Anteprima
              </Link>
            </Button>
          )}
          <DeleteVariantBtn
            variant={variant}
            trailerId={trailerId}
            categoryId={categoryId}
          />
        </div>
      </HeaderBar>
      <NewConfiguration variant={variant} trailerId={trailerId} />
      <ConfigurationsDataTable
        data={allConfigurationsForTable}
        columns={ConfigurationColumnSchema}
        configurations={allConfiguration ? allConfiguration : []}
        variantId={variantId}
      />

      <NewSelectorBtn
        configurations={allConfiguration}
        trailerId={trailerId}
        variant={variant}
      />
      <AllSelectorDataTable
        data={allSelectorForTable}
        columns={SelectorColumnSchema}
        allConfiguration={allConfiguration ? allConfiguration : []}
        selectors={allSelector ? allSelector : []}
        variantId={variantId}
      />

      <div className="my-3">
        <HeaderBar title={"Nodi dei modelli 3D"} subtitle>
          <NewNodeBtn variant={variant} />
        </HeaderBar>
        <NodeDataTable columns={NodeColumnSchema} data={allNodeForTable} />
      </div>
      <HeaderBar title={"Colori"} subtitle>
        <NewColorBtn variant={variant} />
      </HeaderBar>

      <AllColorDataTable
        columns={ColorColumnSchema}
        data={allColorForTable}
        variantId={variantId}
        colors={allColor}
      />

      <EditVariant
        variant={variant}
        images={images}
        canSet3DModel={has3DModelColor}
        canSetConfigurabile={selectorVisible}
      />
    </div>
  );
}

export default page;
