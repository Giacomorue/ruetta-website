"use client";

import HeaderBar from "@/components/admin/header-bar";
import React, { useEffect, useState } from "react";
import { Category, Trailer, Variant } from "prisma/prisma-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import DeleteCategoryBtn from "./delete-category-btn";
import NewVariantBtn from "./new-variant-btn";
import { AllVariantTable } from "./all-variant-table";
import EditCategory from "./edit-category";
import { VariantColumnSchema, VariantColumnType } from "./variant-column";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";

function CategoryPage({
  categoryId,
  trailerId,
}: {
  trailerId: string;
  categoryId: string;
}) {
  const [category, setCategory] = useState<Category>();
  const [trailer, setTrailer] = useState<Trailer>();
  const [allVariant, setAllVariant] = useState<Variant[]>([]);
  const [numberOfActiveVariantion, setNumberOfActiveVariantion] =
    useState<number>();
  const adminLoading = useAdminLoader();
  const router = useRouter();
  const [socketId, setSocketId] = useState<string>();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch("/api/trailerPage/" + trailerId + "/" + categoryId);
      const data = await response.json();

      if (!data.trailer || data.trailer === null) {
        router.push("/admin/rimorchi/404");
      }

      if (!data.category || data.category === null) {
        router.push("/admin/rimorchi/404");
      }

      if (data.category.trailerId !== trailerId) {
        router.push("/admin/rimorchi/404");
      }

      setTrailer(data.trailer);
      setAllVariant(data.allVariant);
      setCategory(data.category);
      setNumberOfActiveVariantion(data.numberOfActiveVariantion);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    try {
      const response = await fetch("/api/trailerPage/" + trailerId + "/" + categoryId);
      const data = await response.json();

      if (!data.trailer || data.trailer === null) {
        router.push("/admin/rimorchi/404");
      }

      if (!data.category || data.category === null) {
        router.push("/admin/rimorchi/404");
      }

      if (data.category.trailerId !== trailerId) {
        router.push("/admin/rimorchi/404");
      }

      setTrailer(data.trailer);
      setAllVariant(data.allVariant);
      setCategory(data.category);
      setNumberOfActiveVariantion(data.numberOfActiveVariantion);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
    }
  };

  useEffect(() => {
    fetchData();

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`dashboard-channel`);

    pusher.connection.bind("connected", () => {
      const id = pusher.connection.socket_id;
      setSocketId(id);
    });

    channel.bind("page-refresh", async (data: any) => {
      fetchDataWithoutLoading();
    });

    return () => {
      channel.unbind("page-refresh");
      pusher.unsubscribe(`dashboard-channel`);
      disconnectPusher();
    };
  }, []);

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
      socketId: socketId?? "",
      onRevalidate: fetchDataWithoutLoading,
    };
  }
  
  function mapVariantsToVariantColumnTypes(
    variants: Variant[],
    trailerId: string
  ): VariantColumnType[] {
    return variants.map((v) => mapVariantToVariantColumnType(v, trailerId));
  }

  const allVariantForTable = allVariant
    ? mapVariantsToVariantColumnTypes(allVariant, trailerId)
    : [];

  if (!category || !trailer) return null;

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
        <DeleteCategoryBtn category={category} socketId={socketId??""} />
      </HeaderBar>
      <NewVariantBtn category={category} socketId={socketId??""} />
      <AllVariantTable
        columns={VariantColumnSchema}
        data={allVariantForTable}
      />
      <EditCategory
        category={category}
        canChangeVisibility={
          numberOfActiveVariantion ? numberOfActiveVariantion > 0 : false
        }
        socketId={socketId?? ""}
      />
    </div>
  );
}

export default CategoryPage;
