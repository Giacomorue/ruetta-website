"use client";

import React from "react";
import { ConfigurationVisibilityCondition } from "prisma/prisma-client";

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
import { DeleteConfigurationVisibilityCondition } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function DeleteConfigurationVisibilityConditionBtn({
  condition,
  socketId,
  onRevalidate,
}: {
  condition: ConfigurationVisibilityCondition;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelete = async () => {
    adminLoader.startLoading();
    await DeleteConfigurationVisibilityCondition(condition.id, socketId).then((res) => {
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
          description:
            "Condizione di visibilità della configurazione cancellata con successo",
        });
        // Se necessario, ricarica la pagina o naviga altrove
        // router.refresh(); // Esempio di refresh della pagina
        onRevalidate();
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2" type="button">
          <Trash className="w-4 h-4" />
          Cancella condizione di visibilità
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare la condizione di visibilità?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non è reversibile e cancellerà anche tutte le
            condizioni figlie collegate.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Cancella</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteConfigurationVisibilityConditionBtn;
