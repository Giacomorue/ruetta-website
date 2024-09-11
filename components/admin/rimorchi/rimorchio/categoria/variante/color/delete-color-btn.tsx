"use client";

import React from "react";
import { Colors } from "prisma/prisma-client";

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
import { DeleteColor } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function DeleteColorBtn({
  color,
  trailerId,
  categoryId,
  socketId
}: {
  color: Colors;
  trailerId: string;
  categoryId: string;
  socketId: string;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelete = async () => {
    adminLoader.startLoading();
    await DeleteColor(color.id, socketId).then((res) => {
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
          description: "Colore cancellato con successo",
        });
        router.push(
          "/admin/rimorchi/" +
            trailerId +
            "/" +
            categoryId +
            "/" +
            color.variantId
        );
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Trash className="w-4 h-4" />
          Cancella colore
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare il colore {color.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa non è un&apos;azione reversibile. Rimuovendo il colore non
            sarà più disponibile nel sito.
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

export default DeleteColorBtn;
