"use client";

import React from "react";
import { ConfigurationChange } from "prisma/prisma-client";

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
import { DeleteConfigurationChange } from "@/actions/trailer"; // Assicurati che questa funzione sia importata correttamente
import { toast } from "@/components/ui/use-toast";

function DeleteConfigurationChangeBtn({
  change,
  onRevalidate,
  socketId,
}: {
  change: ConfigurationChange;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelete = async () => {
    adminLoader.startLoading();
    await DeleteConfigurationChange(change.id, socketId).then((res) => {
      if (!res) return;
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
          description: "Cambiamento di configurazione cancellato con successo",
        });
        // Se necessario, ricarica la pagina o naviga altrove
        // router.refresh(); // Esempio di refresh della pagina
        // window.location.reload();
        onRevalidate();
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog >
      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="outline" className="gap-2" type="button">
          <Trash className="w-4 h-4" />
          Cancella cambiamento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare il cambiamento?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non è reversibile e cancellerà anche tutti i
            cambiamenti collegati.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Annulla
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Cancella
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteConfigurationChangeBtn;
