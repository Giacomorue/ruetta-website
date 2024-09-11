"use client";

import React, { useEffect, useState } from "react";
import HeaderBar from "../../header-bar";
import { Trailer, Image, Category } from "prisma/prisma-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import DeleteRimorchioBtn from "./delete-rimorchio-btn";
import NewCategoryBtn from "./new-category-btn";
import { AllCategoryTable } from "./all-category-table";
import { CategoryColumnSchema, CategoryColumnType } from "./category-column";
import EditRimorchio from "./edit-rimorchio";
import { notFound, useRouter } from "next/navigation";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";



function RimorchioPage({ trailerId }: { trailerId: string }) {
  const [trailer, setTrailer] = useState<Trailer>();
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const adminLoading = useAdminLoader();
  const router = useRouter();
  const [socketId, setSocketId] = useState<string>();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch("/api/trailerPage/" + trailerId, { cache: "no-cache" });
      const data = await response.json();

      if (!data.trailer || data.trailer === null) {
        router.push("/admin/rimorchi/404");
      }

      setTrailer(data.trailer);
      setAllImages(data.images);
      setAllCategory(data.category);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    try {
      const response = await fetch("/api/trailerPage/" + trailerId, { cache: "no-cache" });
      const data = await response.json();

      if (!data.trailer || data.trailer === null) {
        router.push("/admin/rimorchi/404");
      }

      setTrailer(data.trailer);
      setAllImages(data.images);
      setAllCategory(data.category);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
    }
  };

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
      socketId: socketId??"",
      onRevalidate: fetchDataWithoutLoading,
    };
  }
  
  function mapCategoriesToCategoryColumnTypes(
    categories: Category[]
  ): CategoryColumnType[] {
    return categories.map(mapCategoryToCategoryColumnType);
  }

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

  const categoryForTable: CategoryColumnType[] = allCategory
    ? mapCategoriesToCategoryColumnTypes(allCategory)
    : [];

  if (!trailer) return null;

  return (
    <div>
      <HeaderBar
        title={"Rimorchio " + trailer?.name}
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
        <DeleteRimorchioBtn trailer={trailer} socketId={socketId??""} />
      </HeaderBar>
      <NewCategoryBtn trailer={trailer} socketId={socketId??""} />
      <AllCategoryTable
        columns={CategoryColumnSchema}
        data={categoryForTable}
      />
      <EditRimorchio trailer={trailer} images={allImages} socketId={socketId??""} onRevalidate={fetchDataWithoutLoading} />
    </div>
  );
}

export default RimorchioPage;
