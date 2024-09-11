"use client";

import React, { useEffect, useState } from "react";
import { Colors, Image } from "prisma/prisma-client";
import HeaderBar from "@/components/admin/header-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import DeleteColorBtn from "./delete-color-btn";
import EditColorForm from "./edit-color-form";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";

function ColorPage({
  categoryId,
  colorId,
  trailerId,
  variantId,
}: {
  trailerId: string;
  categoryId: string;
  variantId: string;
  colorId: string;
}) {
  const [color, setColor] = useState<Colors>();
  const [images, setImages] = useState<Image[]>([]);
  const adminLoading = useAdminLoader();
  const router = useRouter();
  const [socketId, setSocketId] = useState<string>();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch(
        "/api/trailerPage/" +
          trailerId +
          "/" +
          categoryId +
          "/" +
          variantId +
          "/color/" +
          colorId, { cache: "no-cache" }
      );
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

      if (!data.color) {
        router.push("/admin/rimorchi/404");
      }

      setColor(data.color);
      setImages(data.images);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    try {
      const response = await fetch(
        "/api/trailerPage/" +
          trailerId +
          "/" +
          categoryId +
          "/" +
          variantId +
          "/color/" +
          colorId, { cache: "no-cache" }
      );
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

      if (!data.color) {
        router.push("/admin/rimorchi/404");
      }

      setColor(data.color);
      setImages(data.images);
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

  if (!color) return null;

  return (
    <div>
      <HeaderBar
        title={"Colore " + color.name}
        possibleBackButton={
          <>
            <Button variant={"ghost"}>
              <Link
                href={
                  "/admin/rimorchi/" +
                  trailerId +
                  "/" +
                  categoryId +
                  "/" +
                  variantId
                }
              >
                <IoArrowBack className="w-6 h-6" />
              </Link>
            </Button>
          </>
        }
      >
        <DeleteColorBtn
          color={color}
          trailerId={trailerId}
          categoryId={categoryId}
          socketId={socketId ?? ""}
        />
      </HeaderBar>

      <EditColorForm
        variantId={variantId}
        color={color}
        images={images}
        onRevalidate={fetchDataWithoutLoading}
        socketId={socketId ?? ""}
      />
    </div>
  );
}

export default ColorPage;
