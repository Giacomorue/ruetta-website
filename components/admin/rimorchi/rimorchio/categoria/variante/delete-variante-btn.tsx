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
import { DeleteCategory, DeleteVariant } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function DeleteVariantBtn({
  variant,
  trailerId,
  categoryId,
}: {
  variant: Variant;
  trailerId: string;
  categoryId: string;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelte = async () => {
    adminLoader.startLoading();
    await DeleteVariant(variant.id).then((res) => {
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
          description: "Categoria cancellato con successo",
        });
        router.push("/admin/rimorchi/" + trailerId + "/" + categoryId);
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Trash className="w-4 h-4" />
          Cancella variante
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare la variante {variant.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa non è un&apos;azione reversibile. Rimuovendo la variante
            verranno anche cancellati tutti i preventivi da fare per questo
            rimorchio, ma non quelli già fatti.
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

export default DeleteVariantBtn;
