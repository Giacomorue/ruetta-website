"use client";

import React, { useEffect, useState } from "react";
import { RequestOfPrev, Person, Prisma } from "prisma/prisma-client";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import HeaderBar from "../../header-bar";
import ImageL from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

type TrailerType = Prisma.TrailerGetPayload<{
  include: {
    categories: {
      include: {
        variants: true;
      };
    };
  };
}>;

enum ChoseTrailerState {
  CHOSE_TRAILER,
  CHOSE_CATEGORY,
  CHOSE_VARIANT,
}

function NewReqPage() {
  const [trailer, setTrailer] = useState<TrailerType[]>();
  const adminLoading = useAdminLoader();
  const [socketId, setSocketId] = useState<string>();
  const [choseTrailerId, setChoseTrailerId] = useState<string>();
  const [choseCategoryId, setChoseCategoryId] = useState<string>();
  const [choseTrailerState, setChoseTrailerState] = useState<ChoseTrailerState>(
    ChoseTrailerState.CHOSE_TRAILER
  );

  const router = useRouter();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch("/api/preventivi/newReq", {
        cache: "no-cache",
      });
      const data = await response.json();

      setTrailer(data.trailer);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch("/api/preventivi/newReq", {
        cache: "no-cache",
      });
      const data = await response.json();

      setTrailer(data.trailer);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      adminLoading.stopLoading();
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

  const handleSelectTrailer = (id: string) => {
    setChoseTrailerId(id);
    setChoseTrailerState(ChoseTrailerState.CHOSE_CATEGORY);
  };

  const handleSelectCategory = (id: string) => {
    setChoseCategoryId(id);
    setChoseTrailerState(ChoseTrailerState.CHOSE_VARIANT);
  };

  const handleSelectVariant = (id: string) => {
    //MIGRAZIONE AL PUNTO DI SELEZIONE DELLE CONFIGURAZIONI
    router.push("/admin/preventivo/newReq/" + id);
    // router.push("/admin/preview/" + id);
  };

  if (choseTrailerState === ChoseTrailerState.CHOSE_TRAILER) {
    return (
      <div>
        <HeaderBar title="Scegli il rimorchio" />
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
          {trailer?.map((t) => (
            <div
              key={t.id}
              onClick={() => handleSelectTrailer(t.id)}
              className={`relative rounded-[10px] shadow-lg cursor-pointer ${"bg-white outline-2 outline outline-muted-foreground hover:border-primary  hover:bg-primary hover:text-primary-foreground hover:outline-2 hover:outline hover:outline-primary"} group transition-all duration-150`}
            >
              <div className="relative w-full h-[180px] mb-4 rounded-t-[10px] overflow-hidden">
                <ImageL
                  className="object-cover"
                  src={t.images[0] ?? "/default-image.png"} // Sostituisci `option.imageUrl` con il campo corretto per l'immagine
                  alt={t.name}
                  fill
                />
                <div className="hidden group-hover:flex">
                  <div className="absolute inset-0 bg-black/30 z-10 transition-all duration-150" />
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="z-20 mb-3">
                  <h3
                    className={`font-semibold text-lg group-hover:text-primary-foreground duration-150 transition-all`}
                  >
                    {t.name}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t.description ?? "",
                    }}
                    className={`text-sm line-clamp-3 max-h-[80px] min-h-[80px] group-hover:text-primary-foreground duration-150 transition-all ${"text-muted-foreground"}`}
                  ></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (choseTrailerState === ChoseTrailerState.CHOSE_CATEGORY) {
    if (!trailer || !choseTrailerId) {
      setChoseTrailerId("");
      setChoseTrailerState(ChoseTrailerState.CHOSE_TRAILER);
    }

    const choseTrailer = trailer?.find((t) => t.id === choseTrailerId);

    if (!choseTrailer) {
      setChoseTrailerId("");
      setChoseTrailerState(ChoseTrailerState.CHOSE_TRAILER);
      return null;
    }

    return (
      <div>
        <HeaderBar
          title="Scegli la categoria"
          possibleBackButton={
            <>
              <Button
                variant={"ghost"}
                onClick={() => {
                  setChoseTrailerId("");
                  setChoseTrailerState(ChoseTrailerState.CHOSE_TRAILER);
                }}
              >
                <IoArrowBack className="w-6 h-6" />
              </Button>
            </>
          }
        />
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
          {choseTrailer.categories.map((t) => (
            <div
              key={t.id}
              onClick={() => handleSelectCategory(t.id)}
              className={`relative rounded-[10px] shadow-lg cursor-pointer ${"bg-white outline-2 outline outline-muted-foreground hover:border-primary  hover:bg-primary hover:text-primary-foreground hover:outline-2 hover:outline hover:outline-primary"} group transition-all duration-150`}
            >
              <div className="relative w-full h-[180px] mb-4 rounded-t-[10px] overflow-hidden">
                <ImageL
                  className="object-cover"
                  src={t.images[0] ?? "/default-image.png"} // Sostituisci `option.imageUrl` con il campo corretto per l'immagine
                  alt={t.name}
                  fill
                />
                <div className="hidden group-hover:flex">
                  <div className="absolute inset-0 bg-black/30 z-10 transition-all duration-150" />
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="z-20 mb-3">
                  <h3
                    className={`font-semibold text-lg group-hover:text-primary-foreground duration-150 transition-all`}
                  >
                    {t.name}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t.description ?? "",
                    }}
                    className={`text-sm line-clamp-3 max-h-[80px] min-h-[80px] group-hover:text-primary-foreground duration-150 transition-all ${"text-muted-foreground"}`}
                  ></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    if (!trailer || !choseTrailerId || !choseCategoryId) {
      setChoseTrailerId("");
      setChoseCategoryId("");
      setChoseTrailerState(ChoseTrailerState.CHOSE_TRAILER);
    }

    const choseTrailer = trailer?.find((t) => t.id === choseTrailerId);

    if (!choseTrailer) {
      setChoseTrailerId("");
      setChoseTrailerState(ChoseTrailerState.CHOSE_TRAILER);
      return null;
    }

    const choseCategory = choseTrailer.categories.find(
      (c) => c.id === choseCategoryId
    );

    if (!choseCategory) {
      setChoseCategoryId("");
      setChoseTrailerState(ChoseTrailerState.CHOSE_CATEGORY);
      return null;
    }

    return (
      <div>
        <HeaderBar
          title="Scegli la variante"
          possibleBackButton={
            <>
              <Button
                variant={"ghost"}
                onClick={() => {
                  setChoseCategoryId("");
                  setChoseTrailerState(ChoseTrailerState.CHOSE_CATEGORY);
                }}
              >
                <IoArrowBack className="w-6 h-6" />
              </Button>
            </>
          }
        />
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
          {choseCategory.variants.map((t) => (
            <div
              key={t.id}
              onClick={() => handleSelectVariant(t.accessibleUUID)}
              className={`relative rounded-[10px] shadow-lg cursor-pointer ${"bg-white outline-2 outline outline-muted-foreground hover:border-primary  hover:bg-primary hover:text-primary-foreground hover:outline-2 hover:outline hover:outline-primary"} group transition-all duration-150`}
            >
              <div className="relative w-full h-[180px] mb-4 rounded-t-[10px] overflow-hidden">
                <ImageL
                  className="object-cover"
                  src={t.images[0] ?? "/default-image.png"} // Sostituisci `option.imageUrl` con il campo corretto per l'immagine
                  alt={t.name}
                  fill
                />
                <div className="hidden group-hover:flex">
                  <div className="absolute inset-0 bg-black/30 z-10 transition-all duration-150" />
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="z-20 mb-3">
                  <h3
                    className={`font-semibold text-lg group-hover:text-primary-foreground duration-150 transition-all`}
                  >
                    {t.name}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t.description ?? "",
                    }}
                    className={`text-sm line-clamp-3 max-h-[80px] min-h-[80px] group-hover:text-primary-foreground duration-150 transition-all ${"text-muted-foreground"}`}
                  ></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default NewReqPage;
