"use client";

import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Prisma,
  Node,
  Image,
  Configuration,
  SelectorOption,
} from "prisma/prisma-client";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";
import HeaderBar from "@/components/admin/header-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import DeleteSelectorBtn from "./delete-selector-btn";
import ReorderSelectValueBtn from "./reorder-select-value-btn";
import AddSelectorValueBtn from "./add-selector-value-btn";
import SelectorValueList from "./selector-value-list";
import EditSelectorForm from "./edit-selector-form";
import VisibilityCondition from "./visibility-condition";

type selectorType = Prisma.SelectorGetPayload<{
  include: {
    options: { orderBy: { order: "asc" } };
    selectorVisibilityCondition: true;
  };
}>;

type configurationType = Prisma.ConfigurationGetPayload<{
  include: { values: true };
}>;

type selectorOptionWithChangeType = Prisma.SelectorOptionGetPayload<{
  include: {
    selectorOptionChange: {
      include: {
        change: true;
        elseChange: true;
      };
    };
  };
}>;

function SelectorPage({
  categoryId,
  selectorId,
  trailerId,
  variantId,
}: {
  trailerId: string;
  categoryId: string;
  variantId: string;
  selectorId: string;
}) {
  const [selector, setSelector] = useState<selectorType>();
  const [configuration, setConfiguration] = useState<configurationType>();
  const [selectorOption, setSelectorOption] = useState<SelectorOption[]>();
  const [images, setImages] = useState<Image[]>();
  const [editConfigurations, setEditConfigurations] =
    useState<configurationType[]>();
  const [allSelectorOptionWithChange, setAllSelectorOptionWithChange] =
    useState<selectorOptionWithChangeType[]>();
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
          "/selector/" +
          selectorId, { cache: "no-cache" }
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

      if (!data.selector) {
        router.push("/admin/rimorchi/404");
      }

      setSelector(data.selector);
      setConfiguration(data.configuration);
      setImages(data.images);
      setEditConfigurations(data.editConfigurations);
      setAllSelectorOptionWithChange(data.allSelectorOptionWithChange);
      setSelectorOption(data.selectorOption);
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
          "/selector/" +
          selectorId, { cache: "no-cache" }
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

      if (!data.selector) {
        router.push("/admin/rimorchi/404");
      }

      setSelector(data.selector);
      setConfiguration(data.configuration);
      setImages(data.images);
      setEditConfigurations(data.editConfigurations);
      setAllSelectorOptionWithChange(data.allSelectorOptionWithChange);
      setSelectorOption(data.selectorOption);
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

  if (!selector || !configuration) {
    return null;
  }

  const canAdd = configuration
    ? configuration.values.length > selector.options.length
    : false;

  const usedValues: string[] = selector.options.map(
    (option) => option.valueOfConfigurationToRefer
  );

  const unusedValues = configuration
    ? configuration.values.filter(
        (configValue) => !usedValues.includes(configValue.id)
      )
    : [];

  const canChangeVisibiliy =
    selector.options.filter((f) => f.visible === true).length >= 1;

  return (
    <div>
      <HeaderBar
        title={"Selettore " + selector.name}
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
        <DeleteSelectorBtn
          selector={selector}
          trailerId={trailerId}
          categoryId={categoryId}
          socketId={socketId ?? ""}
        />
      </HeaderBar>
      <HeaderBar title="Valori" subtitle>
        <div className="flex md:flex-row flex-col gap-2 items-center">
          <ReorderSelectValueBtn
            selector={selector}
            values={selector.options}
            disabled={false}
            socketId={socketId ?? ""}
            onRevalidate={fetchDataWithoutLoading}
          />
          <AddSelectorValueBtn
            selector={selector}
            canSetThisOptionValue={unusedValues}
            canAdd={canAdd}
            trailerId={trailerId}
            categoryId={categoryId}
            variantId={variantId}
            onRevalidate={fetchDataWithoutLoading}
            socketId={socketId ?? ""}
          />
        </div>
      </HeaderBar>
      <SelectorValueList
        images={images ? images : []}
        selector={selector}
        selectorOption={selectorOption ? selectorOption : []}
        configurationValue={configuration.values}
        allConfigurations={editConfigurations ? editConfigurations : []}
        allSelectorOptionWithChange={
          allSelectorOptionWithChange ? allSelectorOptionWithChange : []
        }
        socketId={socketId ?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />
      <EditSelectorForm
        selector={selector}
        canSetVisible={canChangeVisibiliy}
        selectorOprtionValueText={configuration.name}
        configurations={editConfigurations ? editConfigurations : []}
        socketId={socketId ?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />
      {/* <div className="my-3"></div> */}
      <HeaderBar title="Condizioni di visibilità" subtitle />
      <VisibilityCondition
        selector={selector}
        variantId={variantId}
        allConfiguration={editConfigurations ? editConfigurations : []}
        visibilityConditions={selector.selectorVisibilityCondition}
        socketId={socketId?? ""}
        onRevalidate={fetchDataWithoutLoading}
      />
    </div>
  );
}

export default SelectorPage;
