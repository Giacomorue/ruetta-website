"use client";

import HeaderBar from "@/components/admin/header-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import DeleteConfigurationBtn from "./delete-configuration-btn";
import AddValueToConfigurationBtn from "./add-configuration-value-btn";
import ConfigurationValueList from "./configuration-value-list";
import EditConfiguration from "./edit-configutation";
import ConfigurationVisibilityCondition from "./configuration-visibility-condition";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";

import { Prisma, Node } from "prisma/prisma-client";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";

type configurationType = Prisma.ConfigurationGetPayload<{
  include: { values: true; configurationVisibilityCondition: true };
}>;

type allConfigurationWithChangeType = Prisma.ConfigurationValueGetPayload<{
  include: {
    configurationChange: {
      include: {
        change: true;
        elseChange: true;
      };
    };
  };
}>;

function ConfigurationPage({
  categoryId,
  configurationId,
  trailerId,
  variantId,
}: {
  trailerId: string;
  categoryId: string;
  variantId: string;
  configurationId: string;
}) {
  const [configuration, setConfiguration] = useState<configurationType>();
  const [allNode, setAllNode] = useState<Node[]>([]);
  const [editConfigurations, setEditConfigurations] = useState<
    configurationType[]
  >([]);
  const [
    allConfigurationWithConfigurationChange,
    setAllConfigurationWithConfigurationChange,
  ] = useState<allConfigurationWithChangeType[]>([]);
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
          "/configurazione/" +
          configurationId
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

      if (!data.configuration) {
        router.push("/admin/rimorchi/404");
      }

      setConfiguration(data.configuration);
      setAllNode(data.allNode);
      setEditConfigurations(data.editConfigurations);
      setAllConfigurationWithConfigurationChange(
        data.allConfigurationWithConfigurationChange
      );
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
          "/configurazione/" +
          configurationId
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

      if (!data.configuration) {
        router.push("/admin/rimorchi/404");
      }

      setConfiguration(data.configuration);
      setAllNode(data.allNode);
      setEditConfigurations(data.editConfigurations);
      setAllConfigurationWithConfigurationChange(
        data.allConfigurationWithConfigurationChange
      );
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

  if (!configuration) {
    return null;
  }

  const allConfigurationWithoutThis = editConfigurations
    ? editConfigurations?.filter((c) => c.id !== configuration.id)
    : [];

  const allConfigurationWithConfigurationChangeForParam =
    allConfigurationWithConfigurationChange.map((value) => ({
      ...value,
      configurationChange: value.configurationChange.map((change) => ({
        ...change,
        change: change.change.map((action) => ({
          ...action,
          position: action.position
            ? {
                x: action.position.x ?? 0, // Assicura che x sia un numero
                y: action.position.y ?? 0, // Assicura che y sia un numero
                z: action.position.z ?? 0, // Assicura che z sia un numero
              }
            : null,
          scale: action.scale
            ? {
                x: action.scale.x ?? 0, // Assicura che x sia un numero
                y: action.scale.y ?? 0, // Assicura che y sia un numero
                z: action.scale.z ?? 0, // Assicura che z sia un numero
              }
            : null,
        })),
        elseChange: change.elseChange.map((action) => ({
          ...action,
          position: action.position
            ? {
                x: action.position.x ?? 0, // Assicura che x sia un numero
                y: action.position.y ?? 0, // Assicura che y sia un numero
                z: action.position.z ?? 0, // Assicura che z sia un numero
              }
            : null,
          scale: action.scale
            ? {
                x: action.scale.x ?? 0, // Assicura che x sia un numero
                y: action.scale.y ?? 0, // Assicura che y sia un numero
                z: action.scale.z ?? 0, // Assicura che z sia un numero
              }
            : null,
        })),
      })),
    }));

  return (
    <div>
      <HeaderBar
        title={"Configurazione " + configuration.name}
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
        <DeleteConfigurationBtn
          configuration={configuration}
          trailerId={trailerId}
          categoryId={categoryId}
          variantId={variantId}
          socketId={socketId ?? ""}
        />
      </HeaderBar>

      <AddValueToConfigurationBtn
        configuration={configuration}
        trailerId={trailerId}
        categoryId={categoryId}
        variantId={variantId}
        socketId={socketId ?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />
      <ConfigurationValueList
        values={configuration.values}
        configuration={configuration}
        allConfigurationWithConfigurationChange={
          allConfigurationWithConfigurationChangeForParam
        }
        allConfigurations={allConfigurationWithoutThis}
        allNode={allNode ? allNode : []}
        socketId={socketId ?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />
      <div className="my-6"></div>
      <EditConfiguration
        configuration={configuration}
        values={configuration.values}
        socketId={socketId ?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />
      <HeaderBar title="Condizioni di visibilità sul preventivo" subtitle />
      <ConfigurationVisibilityCondition
        configuration={configuration}
        variantId={variantId}
        allVisibilityCondition={configuration.configurationVisibilityCondition}
        editConfigurations={editConfigurations}
        onRevalidate={fetchDataWithoutLoading}
        socketId={socketId ?? ""}
      />
    </div>
  );
}

export default ConfigurationPage;
