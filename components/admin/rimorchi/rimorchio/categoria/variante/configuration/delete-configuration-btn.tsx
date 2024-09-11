"use client";

import React, { useEffect, useState } from "react";
import { Configuration } from "prisma/prisma-client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import {
  DeleteCategory,
  DeleteConfiguration,
  DeleteVariant,
} from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DeleteConfigurationBtn({
  configuration,
  variantId,
  trailerId,
  categoryId,
  socketId
}: {
  configuration: Configuration;
  variantId: string;
  trailerId: string;
  categoryId: string;
  socketId: string;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (alertDialogOpen) {
      setMessage("");
    }
  }, [alertDialogOpen]);

  const onDelete = async (id: string) => {
    adminLoader.startLoading();
    await DeleteConfiguration(id, socketId).then((res) => {
      if (!res) return;
      if (res.youCant && res.message) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Non puoi cancellare la configurazione",
        });
        setMessage(
          "<strong>Non puoi cancellare la configurazione poichè è: </strong> " +
            res.message
        );
      }
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
        setAlertDialogOpen(false);
      }
      if (res.success) {
        toast({
          variant: "default",
          title: "Successo",
          description: "Configurazione cancellata con successo",
        });
        setAlertDialogOpen(false);
        router.push(
          "/admin/rimorchi/" + trailerId + "/" + categoryId + "/" + variantId
        );
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <>
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Trash className="w-4 h-4" />
            Cancella configurazione
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {message !== "" ? (
              <DialogTitle className="text-xl">
                Errore nella cancellazione della configurazione{" "}
                {configuration.name}
              </DialogTitle>
            ) : (
              <DialogTitle className="text-xl">
                Sei sicuro di voler cancellare la configurazione{" "}
                {configuration.name}?
              </DialogTitle>
            )}
            {message !== "" ? (
              <DialogDescription
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ) : (
              <DialogDescription>
                Questa non è un&apos;azione reversibile. Rimuovendo la
                configurazione verranno anche cancellati tutti i dati associati.
              </DialogDescription>
            )}
          </DialogHeader>
          {message !== "" ? (
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => {
                  setAlertDialogOpen(false);
                  // setMessage("");
                }}
              >
                Chiudi
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => {
                  setAlertDialogOpen(false);
                  setMessage("");
                }}
              >
                Annulla
              </Button>
              <Button onClick={() => onDelete(configuration.id)}>
                {"Cancella"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteConfigurationBtn;
