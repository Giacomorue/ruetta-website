"use client";

import React from "react";
import { Trailer } from "prisma/prisma-client";

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
import { DelteTrailer } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function DeleteRimorchioBtn({ trailer }: { trailer: Trailer }) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelte = async () => {
    adminLoader.startLoading();
    await DelteTrailer(trailer.id).then((res) => {
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
          description: "Rimorchio cancellato con successo",
        });
        router.push("/admin/rimorchi");
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Trash className="w-4 h-4" />
          Cancella rimorchio
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare il rimorchio {trailer.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa non è un&apos;azione reversibile. Rimuovendo il rimorchio non
            verranno cancellati i preventivi già fatti, ma tutti i dati per i
            preventivi da fare andranno persi e quindi sono da fare a mano!
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

export default DeleteRimorchioBtn;
