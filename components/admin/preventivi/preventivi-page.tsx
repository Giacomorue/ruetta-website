"use client";

import React, { useEffect, useState } from "react";
import { RequestOfPrev, Person, Prisma } from "prisma/prisma-client";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";
import HeaderBar from "../header-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import CreatePersonDialog from "./create-person-dialog";
import { PersonColumnSchema } from "./person-column-schema";
import { DataTable } from "../data-table";
import { RequestOfPrevColumnSchema } from "./request-prev-column-schema";

type PersonType = Prisma.PersonGetPayload<{
  include: {
    requestOfPrev: true;
  };
}>;

type RequestOfPrevType = Prisma.RequestOfPrevGetPayload<{
  include: {
    person: true;
    variant: true;
  };
}>;

function PreventiviPage() {
  const [requestOfPrev, setRequestOfPrev] = useState<RequestOfPrevType[]>();
  const [person, setPerson] = useState<PersonType[]>();
  const adminLoading = useAdminLoader();
  const [socketId, setSocketId] = useState<string>();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch("/api/preventivi", { cache: "no-cache" });
      const data = await response.json();

      setRequestOfPrev(data.requestOfPrev);
      setPerson(data.person);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    try {
      const response = await fetch("/api/preventivi", { cache: "no-cache" });
      const data = await response.json();

      setRequestOfPrev(data.requestOfPrev);
      setPerson(data.person);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
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

  return (
    <>
      <HeaderBar title="Richieste di preventivi">
        <Button asChild>
          <Link href="/admin/preventivi/newReq" className="gap-x-2">
            <FaPlus className="w-4 h-4" />
            <span>Aggiungi una richiesta</span>
          </Link>
        </Button>
      </HeaderBar>

      <DataTable data={requestOfPrev? requestOfPrev : []} columns={RequestOfPrevColumnSchema} />

      <div className="my-3"></div>

      <HeaderBar title="Persone">
        <CreatePersonDialog
          socketId={socketId ?? ""}
          onRevalidate={fetchDataWithoutLoading}
        />
      </HeaderBar>

      <DataTable data={person ? person : []} columns={PersonColumnSchema} />
    </>
  );
}

export default PreventiviPage;
