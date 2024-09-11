"use client";

import React, { useEffect, useState } from "react";
import { Selector } from "prisma/prisma-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Reorder } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { MdMenu } from "react-icons/md";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { ReorderSelectors } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function ReorderSelectorsBtn({
  selectors,
  variantId,
  disabled,
  socketId,
  onRevalidate
}: {
  selectors: Selector[];
  variantId: string;
  disabled: boolean;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const [ordersSelector, setOrdersSelector] = useState(selectors);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrdersSelector(selectors);
    }
  }, [isOpen]);

  const onSave = async () => {
    adminLoader.startLoading();
    await ReorderSelectors(ordersSelector, variantId, socketId).then((res) => {
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
          title: "Successo",
          description: "Selettori riordinati con successo",
        });
        setIsOpen(false);
        onRevalidate();
      }
    });
    adminLoader.stopLoading();
  };

  const isOrderChanged =
    JSON.stringify(selectors) !== JSON.stringify(ordersSelector);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger disabled={disabled} asChild>
        <Button
          variant="outline"
          size={"sm"}
          disabled={disabled}
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Modifica ordine selettori
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica l&apos;ordine dei selettori</DialogTitle>
          <DialogDescription>
            Modifica l&apos;ordine dei selettori per scegliere come si vedranno
            nel configuratore. <br />
            <span className="font-bold">Ricorda:</span> il primo che si vede e
            sempre quello del colore quando è presente.
          </DialogDescription>
        </DialogHeader>
        <Reorder.Group
          axis="y"
          values={ordersSelector}
          onReorder={setOrdersSelector}
          className="flex flex-col items-center w-full gap-4 py-4"
        >
          {ordersSelector.map((selector) => (
            <Reorder.Item
              value={selector}
              key={selector.id}
              className="rounded-xl border border-input bg-transparent px-3 py-2 text-lg shadow-sm transition-colors w-full font-medium cursor-grab flex flex-row items-center gap-3"
            >
              <MdMenu className="w-4 h-4" />
              {selector.name}
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <DialogFooter>
          <Button disabled={!isOrderChanged} onClick={onSave}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReorderSelectorsBtn;
