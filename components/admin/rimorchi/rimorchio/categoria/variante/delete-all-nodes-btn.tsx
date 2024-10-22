"use client";

import React from "react";
import { Variant } from "prisma/prisma-client";

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
import { DeleteAllNodesOfVariant } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function DeleteAllNodesBtn({
  variant,
  socketId,
  onRevalidate,
}: {
  variant: Variant;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelete = async () => {
    adminLoader.startLoading();
    await DeleteAllNodesOfVariant(variant.id, socketId).then((res) => {
      if (!res) return;
      if (res.youCant && res.message) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.message,
        });
      } else if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      } else if (res.success) {
        toast({
          variant: "default",
          title: "Successo",
          description:
            "Tutti i nodi della variante sono stati cancellati con successo",
        });
        // Optionally, you can refresh the page or navigate as needed
        onRevalidate();
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Trash className="w-4 h-4" />
          Cancella tutti i nodi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare tutti i nodi della variante{" "}
            {variant.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non è reversibile. Rimuovendo tutti i nodi, non
            saranno più accessibili.
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

export default DeleteAllNodesBtn;
