import { DataTable } from "@/components/admin/data-table";
import HeaderBar from "@/components/admin/header-bar";
import DeleteCategoryBtn from "@/components/admin/rimorchi/rimorchio/categoria/delete-category-btn";
import EditCategory from "@/components/admin/rimorchi/rimorchio/categoria/edit-category";
import NewVariantBtn from "@/components/admin/rimorchi/rimorchio/categoria/new-variant-btn";
import { VariantColumnSchema, VariantColumnType } from "@/components/admin/rimorchi/rimorchio/categoria/variant-column";
import { GetAllImages } from "@/data/images";
import { GetAllTrailerDescIncludeCategories, GetAllVariantDescByCategoryId, GetCategoryById, GetNumberOfVariantVisibleInCategoryById, GetTrailerById } from "@/data/trailer";
import { notFound } from "next/navigation";
import React from "react";

import { Variant } from "prisma/prisma-client"
import { AllVariantTable } from "@/components/admin/rimorchi/rimorchio/categoria/all-variant-table";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

function mapVariantToVariantColumnType(
  variant: Variant,
  trailerId: string
): VariantColumnType {
  return {
    trailerId: trailerId, // Assumendo che `trailerId` venga dall'id della categoria
    categoryId: variant.categoryId,
    id: variant.id,
    name: variant.name,
    prezzo: variant.prezzo,
    visible: variant.visible,
    configurable: variant.configurable,
    updatedAt: variant.updatedAt,
    createdAt: variant.createdAt,
    has3DModel: variant.has3DModel,
  };
}

function mapVariantsToVariantColumnTypes(variants: Variant[], trailerId: string): VariantColumnType[] {
  return variants.map((v) => mapVariantToVariantColumnType(v, trailerId));
}

async function page({
  params: { trailerId, categoryId },
}: {
  params: { trailerId: string; categoryId: string };
}) {
  //CONTROLLI SE ESISTE TUTTO

  const trailer = await GetTrailerById(trailerId);

  if (!trailer) {
    notFound();
  }

  const category = await GetCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  if (category.trailerId !== trailerId) {
    notFound();
  }

  const allVariant = await GetAllVariantDescByCategoryId(categoryId);

  const allVariantForTable = allVariant ? mapVariantsToVariantColumnTypes(allVariant, trailerId) : [];

  const numberOfActiveVariantion = await GetNumberOfVariantVisibleInCategoryById(categoryId);

  return (
    <div>
      <HeaderBar
        title={
          "Sottocategoria " + category.name + " del rimorchio " + trailer.name
        }
        possibleBackButton={
          <>
            <Button variant={"ghost"}>
              <Link href={"/admin/rimorchi/" + trailerId}>
                <IoArrowBack className="w-6 h-6" />
              </Link>
            </Button>
          </>
        }
      >
        <DeleteCategoryBtn category={category} />
      </HeaderBar>
      <NewVariantBtn category={category} />
      <AllVariantTable
        columns={VariantColumnSchema}
        data={allVariantForTable}
      />
      <EditCategory
        category={category}
        canChangeVisibility={
          numberOfActiveVariantion ? numberOfActiveVariantion > 0 : false
        }
      />
    </div>
  );
}

export default page;
