"use client";

import React from "react";
import { Category } from "prisma/prisma-client";

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
import { DeleteCategory } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function DeleteCategoryBtn({ category, socketId }: { category: Category, socketId: string }) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelte = async () => {
    adminLoader.startLoading();
    await DeleteCategory(category.id, socketId).then((res) => {
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
        router.push("/admin/rimorchi/" + category.trailerId);
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Trash className="w-4 h-4" />
          Cancella sottocategoria
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare la sottocategoria {category.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa non è un&apos;azione reversibile. Rimuovendo la categoria
            verranno cancellati anche tutte le varianti sottostanti, ciò non
            comporta il cancellamento dei preventivi già richiesti!
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

export default DeleteCategoryBtn;
