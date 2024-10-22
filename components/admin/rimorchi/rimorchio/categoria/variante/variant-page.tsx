"use client";

import React, { useEffect, useState } from "react";
import {
  Variant,
  Image,
  Configuration,
  Selector,
  Node,
  ConfigurationValue,
  SelectorOption,
  Prisma,
} from "prisma/prisma-client";
import HeaderBar from "@/components/admin/header-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import DeleteVariantBtn from "./delete-variante-btn";
import NewConfiguration from "./new-configuration-btn";
import { ConfigurationsDataTable } from "./configurations-data-table";
import {
  ConfigurationColumnSchema,
  ConfigurationColumnType,
} from "./configuration-column";
import NewSelectorBtn from "./new-selector-btn";
import { AllSelectorDataTable } from "./selector-data-table";
import { SelectorColumnSchema, SelectorColumnType } from "./selector-column";
import NewNodeBtn from "./new-node-btn";
import { NodeDataTable } from "./node-data-table";
import { NodeColumnSchema, NodeColumnType } from "./node-column";
import EditVariant from "./edit-variant";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";
import DeleteAllNodesBtn from "./delete-all-nodes-btn";

type SelectorWithOptions = Prisma.SelectorGetPayload<{
  include: { options: true };
}>;

type ConfigurationWithValues = Prisma.ConfigurationGetPayload<{
  include: { values: true };
}>;

function VariantPage({
  categoryId,
  trailerId,
  variantId,
}: {
  trailerId: string;
  categoryId: string;
  variantId: string;
}) {
  // const [variant, images, allConfiguration, allSelector, allNode, allColor]
  const [variant, setVariant] = useState<Variant>();
  const [images, setImages] = useState<Image[]>([]);
  const [allConfiguration, setAllConfiguration] =
    useState<ConfigurationWithValues[]>();
  const [allSelector, setAllSelector] = useState<SelectorWithOptions[]>();
  const [allNode, setAllNode] = useState<Node[]>([]);
  const adminLoading = useAdminLoader();
  const router = useRouter();
  const [socketId, setSocketId] = useState<string>();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch(
        "/api/trailerPage/" + trailerId + "/" + categoryId + "/" + variantId,
        { cache: "no-cache" }
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

      setVariant(data.variant);
      // setImages(data.images);
      setAllConfiguration(data.allConfiguration);
      console.log("All configuration", data.allConfiguration);
      setAllSelector(data.allSelector);
      setAllNode(data.allNode);
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
        "/api/trailerPage/" + trailerId + "/" + categoryId + "/" + variantId,
        { cache: "no-cache" }
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

      setVariant(data.variant);
      setImages(data.images);
      setAllConfiguration(data.allConfiguration);
      setAllSelector(data.allSelector);
      setAllNode(data.allNode);
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

  if (!variant) {
    return null;
  }

  const allConfigurationsForTable: ConfigurationColumnType[] = allConfiguration
    ? allConfiguration.map((config) => ({
        id: config.id,
        name: config.name,
        defaultValue:
          config.values.find((v) => v.id === config.defaultValue)?.value ||
          config.defaultValue,
        variantId: config.variantId,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
        order: config.order,
        socketId: socketId ?? "",
        onRevalidate: fetchDataWithoutLoading,
      }))
    : [];

  const allSelectorForTable: SelectorColumnType[] = allSelector
    ? allSelector.map((selector) => ({
        id: selector.id,
        name: selector.name,
        configurationToRefer:
          allConfiguration?.find((c) => c.id === selector.configurationToRefer)
            ?.name || selector.configurationToRefer,
        visible: selector.visible,
        nOption: selector.options.length,
        createdAt: selector.createdAt,
        updatedAt: selector.updatedAt,
        order: selector.order,
        socketId: socketId ?? "",
        onRevalidate: fetchDataWithoutLoading,
      }))
    : [];

  const selectorVisible = allSelector
    ? allSelector.filter((f) => f.visible === true).length > 0
    : false;

  const allNodeForTable: NodeColumnType[] = allNode
    ? allNode.map((node) => ({
        id: node.id,
        name: node.name,
        alwaysHidden: node.alwaysHidden,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        variantId: node.variantId,
        socketId: socketId ?? "",
        onRevalidate: fetchDataWithoutLoading,
      }))
    : [];

  return (
    <div>
      <HeaderBar
        title={"Variante " + variant?.name}
        possibleBackButton={
          <>
            <Button variant={"ghost"}>
              <Link href={"/admin/rimorchi/" + trailerId + "/" + categoryId}>
                <IoArrowBack className="w-6 h-6" />
              </Link>
            </Button>
          </>
        }
      >
        <div className="flex flex-row items-center gap-x-2">
          {selectorVisible && (
            <Button variant={"default"} asChild className="gap-x-2">
              <Link href={"/admin/preview/" + variant.accessibleUUID}>
                <FaEye /> Anteprima
              </Link>
            </Button>
          )}
          <DeleteVariantBtn
            variant={variant}
            trailerId={trailerId}
            categoryId={categoryId}
            socketId={socketId ?? ""}
          />
        </div>
      </HeaderBar>
      <NewConfiguration
        variant={variant}
        trailerId={trailerId}
        socketId={socketId ?? ""}
      />
      <ConfigurationsDataTable
        data={allConfigurationsForTable}
        columns={ConfigurationColumnSchema}
        configurations={allConfiguration ? allConfiguration : []}
        variantId={variantId}
        socketId={socketId ?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />

      <NewSelectorBtn
        socketId={socketId ?? ""}
        configurations={allConfiguration ?? []}
        trailerId={trailerId}
        variant={variant}
      />
      <AllSelectorDataTable
        data={allSelectorForTable}
        columns={SelectorColumnSchema}
        allConfiguration={allConfiguration ? allConfiguration : []}
        selectors={allSelector ? allSelector : []}
        variantId={variantId}
        onRevalidate={fetchDataWithoutLoading}
        socketId={socketId ?? ""}
      />

      <div className="my-3">
        <HeaderBar title={"Nodi dei modelli 3D"} subtitle>
          <div className="flex flex-row gap-2 items-center">
            <DeleteAllNodesBtn variant={variant} socketId={socketId??""} onRevalidate={fetchDataWithoutLoading} />
            <NewNodeBtn
              variant={variant}
              socketId={socketId ?? ""}
              onRevalidate={fetchDataWithoutLoading}
            />
          </div>
        </HeaderBar>
        <NodeDataTable columns={NodeColumnSchema} data={allNodeForTable} />
      </div>

      <EditVariant
        variant={variant}
        images={images}
        canSet3DModel={false}
        canSetConfigurabile={selectorVisible}
        socketId={socketId ?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />
    </div>
  );
}

export default VariantPage;
