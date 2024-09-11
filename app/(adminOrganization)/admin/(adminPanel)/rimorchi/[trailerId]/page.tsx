import { DataTable } from "@/components/admin/data-table";
import HeaderBar from "@/components/admin/header-bar";
import {
  CategoryColumnSchema,
  CategoryColumnType,
} from "@/components/admin/rimorchi/rimorchio/category-column";
import DeleteRimorchioBtn from "@/components/admin/rimorchi/rimorchio/delete-rimorchio-btn";
import EditRimorchio from "@/components/admin/rimorchi/rimorchio/edit-rimorchio";
import NewCategoryBtn from "@/components/admin/rimorchi/rimorchio/new-category-btn";
import { GetAllImages } from "@/data/images";
import { GetAllCategoryDescByTrailerId, GetTrailerById } from "@/data/trailer";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { Category } from "prisma/prisma-client";
import { AllCategoryTable } from "@/components/admin/rimorchi/rimorchio/all-category-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import RimorchioPage from "@/components/admin/rimorchi/rimorchio/rimorchio-page";


async function page({
  params: { trailerId },
}: {
  params: { trailerId: string };
}) {
  return <RimorchioPage trailerId={trailerId} />;
}

export default page;