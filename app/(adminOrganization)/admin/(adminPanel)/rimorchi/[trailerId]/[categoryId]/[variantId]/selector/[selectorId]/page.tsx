import HeaderBar from "@/components/admin/header-bar";
import AddSelectorValueBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/add-selector-value-btn";
import DeleteSelectorBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/delete-selector-btn";
import EditSelector from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/edit-selector-form";
import ReorderSelectValueBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/reorder-select-value-btn";
import SelectorValueList from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/selector-value-list";
import VisibilityCondition from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/visibility-condition";
import { Button } from "@/components/ui/button";
import { GetAllImages } from "@/data/images";
import {
  GetAllSelectorOptionWithSelectorOptionChangeBySelectroId,
  GetAllSelectorValueBySelectorId,
  GetConfigurationById,
  GetConfigurationByVariantId,
  GetSelectorById,
  GetVariantyById,
} from "@/data/trailer";
import { ArrowUpDown, ArrowUpDownIcon, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { FaArrowsUpDown } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";

async function page({
  params: { trailerId, categoryId, variantId, selectorId },
}: {
  params: {
    trailerId: string;
    categoryId: string;
    variantId: string;
    selectorId: string;
  };
}) {
  const variant = await GetVariantyById(variantId);

  if (!variant) {
    notFound();
  }

  const selector = await GetSelectorById(selectorId);

  if (!selector) {
    notFound();
  }

  if (variant.id !== selector.variantId) {
    notFound();
  }

  const configuration = await GetConfigurationById(
    selector.configurationToRefer
  );

  if (!configuration) {
    notFound();
  }

  const canAdd = configuration.values.length > selector.options.length;

  const selectorOption = await GetAllSelectorValueBySelectorId(selectorId);

  const usedValues: string[] = selector.options.map(
    (option) => option.valueOfConfigurationToRefer
  );

  const unusedValues = configuration.values.filter(
    (configValue) => !usedValues.includes(configValue.id)
  );

  const images = await GetAllImages();

  const canChangeVisibiliy =
    selector.options.filter((f) => f.visible === true).length >= 2;

  const editConfigurations = await GetConfigurationByVariantId(variantId);

  if (!editConfigurations) {
    notFound();
  }

  const allSelectorOptionWithChange =
    await GetAllSelectorOptionWithSelectorOptionChangeBySelectroId(selector.id);

  console.log(allSelectorOptionWithChange);

  return (
    <div>
      <HeaderBar
        title={"Selettore " + selector.name}
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
        <DeleteSelectorBtn
          selector={selector}
          trailerId={trailerId}
          categoryId={categoryId}
        />
      </HeaderBar>
      <HeaderBar title="Valori" subtitle>
        <div className="flex md:flex-row flex-col gap-2 items-center">
          <ReorderSelectValueBtn
            selector={selector}
            values={selector.options}
            disabled={false}
          />
          <AddSelectorValueBtn
            selector={selector}
            canSetThisOptionValue={unusedValues}
            canAdd={canAdd}
            trailerId={trailerId}
            categoryId={categoryId}
            variantId={variantId}
          />
        </div>
      </HeaderBar>
      <SelectorValueList
        images={images}
        selector={selector}
        selectorOption={selectorOption ? selectorOption : []}
        configurationValue={configuration.values}
        allConfigurations={editConfigurations}
        allSelectorOptionWithChange={allSelectorOptionWithChange}
      />
      <EditSelector
        selector={selector}
        canSetVisible={canChangeVisibiliy}
        selectorOprtionValueText={configuration.name}
        configurations={editConfigurations}
      />
      {/* <div className="my-3"></div> */}
      <HeaderBar title="Condizioni di visibilità" subtitle />
      <VisibilityCondition selector={selector} variantId={variantId} />
    </div>
  );
}

export default page;
