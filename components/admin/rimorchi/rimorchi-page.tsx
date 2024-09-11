"use client";

import React, { useEffect, useState } from "react";
import HeaderBar from "@/components/admin/header-bar";
import NewRimorchioBtn from "./new-rimorchio-btn";
import { AllRimorchiDataTable } from "./all-rimorchi-data-table";
import { GetAllTrailerDescIncludeCategories } from "@/data/trailer";
import { RimorchiColumnSchema, RimorchiColumnType } from "./rimorchi-column";
import { GetAllImages } from "@/data/images";

// Funzione per trasformare i dati dei rimorchi
import { Trailer, Image } from "prisma/prisma-client";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { getPusherClient, disconnectPusher } from "@/lib/pusherClient";

const RimorchiPage = () => {
  const [trailers, setTrailers] = useState<Trailer[] | null>([]);
  const adminLoading = useAdminLoader();
  const [socketId, setSocketId] = useState<string>();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      await fetch("/api/trailer", { cache: "no-cache" })
        .then((response) => response.json())
        .then((data) => setTrailers(data));
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    // adminLoading.startLoading();
    try {
      await fetch("/api/trailer", { cache: "no-cache" })
        .then((response) => response.json())
        .then((data) => setTrailers(data));
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      // adminLoading.stopLoading();
    }
  };

  useEffect(() => {
    fetchData();

    const pusher = getPusherClient();
    const channel = pusher.subscribe("dashboard-channel");

    pusher.connection.bind("connected", () => {
      const id = pusher.connection.socket_id;
      setSocketId(id);
    });

    channel.bind("page-refresh", async (data: any) => {
      fetchDataWithoutLoading();
    });

    return () => {
      channel.unbind("page-refresh");
      pusher.unsubscribe("dashboard-channel");
      disconnectPusher();
    };
  }, []);

  const transformTrailers = (trailers: any[]): RimorchiColumnType[] => {
    return trailers.map((trailer) => ({
      id: trailer.id,
      name: trailer.name,
      description: trailer.description,
      fornitore: trailer.fornitore,
      images: trailer.images,
      updatedAt: new Date(trailer.updatedAt),
      createdAt: new Date(trailer.createdAt),
      categories: trailer.categories,
      visibile: trailer.visible,
      onRefetch: fetchDataWithoutLoading,
      socketId: socketId??"",
    }));
  };

  const trailerForTable = trailers ? transformTrailers(trailers) : [];

  return (
    <>
      <HeaderBar title="Rimorchi">
        <NewRimorchioBtn
          socketId={socketId ?? ""}
          onRevalidate={fetchDataWithoutLoading}
        />
      </HeaderBar>
      <AllRimorchiDataTable
        columns={RimorchiColumnSchema}
        data={trailerForTable}
      />
    </>
  );
};

export default RimorchiPage;
