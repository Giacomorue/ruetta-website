import { DataTable } from "@/components/admin/data-table";
import HeaderBar from "@/components/admin/header-bar";
import { AllRimorchiDataTable } from "@/components/admin/rimorchi/all-rimorchi-data-table";
import {
  RimorchiColumnSchema,
  RimorchiColumnType,
} from "@/components/admin/rimorchi/rimorchi-column";
import { Fornitori } from "@/constants";
// import NewRimorchioBtn from "@/components/admin/rimorchi/new-rimorchio-btn";
import { GetAllImages } from "@/data/images";
import { GetAllTrailerDescIncludeCategories } from "@/data/trailer";
import dynamic from "next/dynamic";
import { Category } from "prisma/prisma-client";
import React, { Suspense } from "react";
import { ImSpinner2 } from "react-icons/im";

const NewRimorchioBtn = dynamic(
  () => import("@/components/admin/rimorchi/new-rimorchio-btn"),
  {
    ssr: false,
  }
);

const transformTrailers = (trailers: any[]): RimorchiColumnType[] => {
  return trailers.map((trailer) => ({
    id: trailer.id,
    name: trailer.name,
    description: trailer.description,
    fornitore: trailer.fornitore,
    images: trailer.images,
    updatedAt: new Date(trailer.updatedAt), // Assicurati che sia un oggetto Date
    createdAt: new Date(trailer.createdAt), // Assicurati che sia un oggetto Date
    categories: trailer.categories as Category[], // Cast per garantire che sia un array di Category
    visibile: trailer.visible,
  }));
};

async function page() {
  return (
    <Suspense fallback={<Loader />}>
      <AusiliarPage />
    </Suspense>
  );
}

export default page;

const AusiliarPage = async () => {
  const [images, trailers] = await Promise.all([
    GetAllImages(),
    GetAllTrailerDescIncludeCategories(),
  ]);

  const trailersForTable: RimorchiColumnType[] = trailers
    ? transformTrailers(trailers)
    : [];

  return (
    <>
      <HeaderBar title="Rimorchi">
        <NewRimorchioBtn images={images} />
      </HeaderBar>
      <AllRimorchiDataTable
        columns={RimorchiColumnSchema}
        data={trailersForTable}
      />
    </>
  );
};

const Loader = () => {
  return (
    <div className="z-[100] flex flex-col items-center justify-center inset-0 bg-background/30 fixed top-0 left-0 h-[100vh] w-[100vw]">
      <ImSpinner2 className="animate-spin w-20 h-20 text-primary" />
    </div>
  );
};
