import { DataTable } from "@/components/admin/data-table";
import HeaderBar from "@/components/admin/header-bar";
import { AllRimorchiDataTable } from "@/components/admin/rimorchi/all-rimorchi-data-table";
import {
  RimorchiColumnSchema,
  RimorchiColumnType,
} from "@/components/admin/rimorchi/rimorchi-column";
import RimorchiPage from "@/components/admin/rimorchi/rimorchi-page";
import { Fornitori } from "@/constants";
// import NewRimorchioBtn from "@/components/admin/rimorchi/new-rimorchio-btn";
import { GetAllImages } from "@/data/images";
import { GetAllTrailerDescIncludeCategories } from "@/data/trailer";
import { Category } from "prisma/prisma-client";
import React, { Suspense } from "react";
import { ImSpinner2 } from "react-icons/im";


export const dynamic = 'force-dynamic'


async function page() {
  return <RimorchiPage />
}

export default page;

