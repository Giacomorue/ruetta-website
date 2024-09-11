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
import VariantPage from "@/components/admin/rimorchi/rimorchio/categoria/variante/variant-page";
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
  return <VariantPage trailerId={trailerId} categoryId={categoryId} variantId={variantId} />
}

export default page;
