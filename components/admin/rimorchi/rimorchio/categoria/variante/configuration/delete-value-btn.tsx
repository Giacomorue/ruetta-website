"use client";

import React, { useEffect, useState } from "react";
import { ConfigurationValue } from "prisma/prisma-client";

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
  DeleteConfigurationValue,
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

function DeleteValueBtn({
  value,
  disabled,
}: {
  value: ConfigurationValue;
  disabled: boolean;
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

  const onDelte = async () => {
    adminLoader.startLoading();
    await DeleteConfigurationValue(value.id).then((res) => {
      if (!res) return;
      if (res.youCant && res.message) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Non puoi cancellare il valore della configurazione",
        });
        setMessage(
          "<strong>Non puoi cancellare il valore della configurazione poichè è: </strong> " +
            res.message
        );
      }
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      }
      if (res.success) {
        toast({
          variant: "default",
          title: "Successo",
          description: "Valore cancellato con successo",
        });
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <DialogTrigger disabled={disabled}>
        <Button
          disabled={disabled}
          variant="outline"
          className="gap-2"
          type="button"
        >
          <Trash className="w-4 h-4" />
          Cancella valore
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {message !== "" ? (
            <DialogTitle className="text-xl">
              Errore nella cancellazione della configurazione {value.value}
            </DialogTitle>
          ) : (
            <DialogTitle className="text-xl">
              Sei sicuro di voler cancellare la configurazione {value.value}?
            </DialogTitle>
          )}
          {message !== "" ? (
            <DialogDescription dangerouslySetInnerHTML={{ __html: message }} />
          ) : (
            <DialogDescription>
              Questa non è un&apos;azione reversibile. Rimuovendo il valore
              della configurazione non sarà più possibile leggerlo per creare i
              preventivi.
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
            <Button onClick={() => onDelte()}>{"Cancella"}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DeleteValueBtn;
