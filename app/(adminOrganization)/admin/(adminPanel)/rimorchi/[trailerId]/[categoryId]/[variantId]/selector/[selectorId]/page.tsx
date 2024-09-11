import HeaderBar from "@/components/admin/header-bar";
import AddSelectorValueBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/add-selector-value-btn";
import DeleteSelectorBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/delete-selector-btn";
import EditSelector from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/edit-selector-form";
import ReorderSelectValueBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/reorder-select-value-btn";
import SelectorPage from "@/components/admin/rimorchi/rimorchio/categoria/variante/selector/selector-page";
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

  return <SelectorPage categoryId={categoryId} selectorId={selectorId} trailerId={trailerId} variantId={variantId} />
  
}

export default page;
