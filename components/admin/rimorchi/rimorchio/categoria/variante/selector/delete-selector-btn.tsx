"use client";

import React from "react";
import { Selector } from "prisma/prisma-client";

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
  DeleteSelector,
  DeleteVariant,
} from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function DeleteSelectorBtn({
  selector,
  trailerId,
  categoryId,
  socketId,
}: {
  selector: Selector;
  trailerId: string;
  categoryId: string;
  socketId: string;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelte = async () => {
    adminLoader.startLoading();
    await DeleteSelector(selector.id, socketId).then((res) => {
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
          description: "Selettore cancellato con successo",
        });
        router.push(
          "/admin/rimorchi/" +
            trailerId +
            "/" +
            categoryId +
            "/" +
            selector.variantId
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
          Cancella selettore
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare il selettore {selector.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa non è un&apos;azione reversibile. Rimuovendo il selettore non
            sara più possibile usarlo nel sito
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction onClick={onDelte}>Cancella</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteSelectorBtn;
