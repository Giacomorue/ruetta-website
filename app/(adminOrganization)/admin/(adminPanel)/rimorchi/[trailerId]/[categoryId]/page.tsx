import { DataTable } from "@/components/admin/data-table";
import HeaderBar from "@/components/admin/header-bar";
import DeleteCategoryBtn from "@/components/admin/rimorchi/rimorchio/categoria/delete-category-btn";
import EditCategory from "@/components/admin/rimorchi/rimorchio/categoria/edit-category";
import NewVariantBtn from "@/components/admin/rimorchi/rimorchio/categoria/new-variant-btn";
import {
  VariantColumnSchema,
  VariantColumnType,
} from "@/components/admin/rimorchi/rimorchio/categoria/variant-column";
import { GetAllImages } from "@/data/images";
import {
  GetAllTrailerDescIncludeCategories,
  GetAllVariantDescByCategoryId,
  GetCategoryById,
  GetNumberOfVariantVisibleInCategoryById,
  GetTrailerById,
} from "@/data/trailer";
import { notFound } from "next/navigation";
import React from "react";

import { Variant } from "prisma/prisma-client";
import { AllVariantTable } from "@/components/admin/rimorchi/rimorchio/categoria/all-variant-table";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import CategoryPage from "@/components/admin/rimorchi/rimorchio/categoria/category-page";

async function page({
  params: { trailerId, categoryId },
}: {
  params: { trailerId: string; categoryId: string };
}) {
  return <CategoryPage categoryId={categoryId} trailerId={trailerId} />;
}

export default page;
