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
import React from "react";
import { Category } from "prisma/prisma-client";
import { AllCategoryTable } from "@/components/admin/rimorchi/rimorchio/all-category-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

function mapCategoryToCategoryColumnType(
  category: Category
): CategoryColumnType {
  return {
    id: category.id,
    name: category.name,
    updatedAt: category.updatedAt,
    createdAt: category.createdAt,
    visible: category.visible,
    trailerId: category.trailerId,
  };
}

function mapCategoriesToCategoryColumnTypes(
  categories: Category[]
): CategoryColumnType[] {
  return categories.map(mapCategoryToCategoryColumnType);
}

async function page({
  params: { trailerId },
}: {
  params: { trailerId: string };
}) {
  const trailer = await GetTrailerById(trailerId);

  if (!trailer) {
    notFound();
  }

  const allImages = await GetAllImages();
  const allCategory = await GetAllCategoryDescByTrailerId(trailerId);

  const categoryForTable: CategoryColumnType[] = allCategory
    ? mapCategoriesToCategoryColumnTypes(allCategory)
    : [];

  return (
    <div>
      <HeaderBar
        title={"Rimorchio " + trailer.name}
        possibleBackButton={
          <>
            <Button variant={"ghost"}>
              <Link href={"/admin/rimorchi/"}>
                <IoArrowBack className="w-6 h-6" />
              </Link>
            </Button>
          </>
        }
      >
        <DeleteRimorchioBtn trailer={trailer} />
      </HeaderBar>
      <NewCategoryBtn trailer={trailer} />
      <AllCategoryTable
        columns={CategoryColumnSchema}
        data={categoryForTable}
      />
      <EditRimorchio trailer={trailer} images={allImages} />
    </div>
  );
}

export default page;
