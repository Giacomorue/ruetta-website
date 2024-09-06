"use client";

import React from "react";
import { SelectorOption } from "prisma/prisma-client";

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
  DeleteSelectorValue,
  DeleteVariant,
} from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { CheckTypeChange } from "prisma/prisma-client";

type SelectorOptionWithChanges = {
  id: string;
  label: string;
  valueOfConfigurationToRefer: string;
  visible: boolean;
  modalDescription: string;
  images: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
  selectorId: string;
  selectorOptionChange: {
    id: string;
    haveIf: boolean;
    configurationId: string | null;
    checkType: CheckTypeChange;
    expectedValue: string | null;
    parentId: string | null;
    isFirstNode: boolean;
    ifRecId: string[];
    elseRecId: string[];
    createdAt: Date;
    updatedAt: Date;
    selectorOptionId: string;
    change: {
      id: string;
      configurationToChangeId: string;
      newValueValue: string | null;
      selectorOptionChangeId: string | null;
      selectorOptionElseChangeId: string | null;
    }[];
    elseChange: {
      id: string;
      configurationToChangeId: string;
      newValueValue: string | null;
      selectorOptionChangeId: string | null;
      selectorOptionElseChangeId: string | null;
    }[];
  }[];
};

function DeleteSelectorValueBtn({
  value,
  disabled,
}: {
  value: SelectorOptionWithChanges;
  disabled: boolean;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const onDelte = async () => {
    adminLoader.startLoading();
    await DeleteSelectorValue(value.id).then((res) => {
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
          description: "Valore cancellato con successo",
        });
      }
    });
    adminLoader.stopLoading();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled} asChild>
        <Button
          variant="outline"
          className="gap-2"
          type="button"
          disabled={disabled}
        >
          <Trash className="w-4 h-4" />
          Cancella valore
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare il valore {value.label}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non è reversibile e non sarà possibile utilizzarlo
            come scelta all&apos;interno del configuratore
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

export default DeleteSelectorValueBtn;
