"use client";

import React, { useEffect, useState } from "react";
import { SelectorOption, Selector } from "prisma/prisma-client";
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
import { ReorderSelectorValue } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function ReorderSelectValueBtn({
  values,
  selector,
  disabled,
}: {
  values: SelectorOption[];
  selector: Selector;
  disabled: boolean;
}) {
  const adminLoader = useAdminLoader();
  const [ordersValue, setOrdersValue] = useState(values);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrdersValue(values);
    }
  }, [isOpen]);

  const onSave = async () => {
    adminLoader.startLoading();
    await ReorderSelectorValue(ordersValue, selector.id).then((res) => {
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
          description: "Valori aggiunti con successo",
        });
        setIsOpen(false);
      }
    });
    adminLoader.stopLoading();
  };

  const isOrderChanged = JSON.stringify(values) !== JSON.stringify(ordersValue);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger disabled={disabled} asChild>
        <Button variant="outline" disabled={disabled} className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Modifica posizioni
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica posizioni</DialogTitle>
          <DialogDescription>
            Modifica le posizioni del selettore {selector.name}
          </DialogDescription>
        </DialogHeader>
        <Reorder.Group
          axis="y"
          values={ordersValue}
          onReorder={setOrdersValue}
          className="flex flex-col items-center w-full gap-4 py-4"
        >
          {ordersValue.map((value) => (
            <Reorder.Item
              value={value}
              key={value.id}
              className="rounded-xl border border-input bg-transparent px-3 py-2 text-lg shadow-sm transition-colors w-full font-medium cursor-grab flex flex-row items-center gap-3"
            >
              <MdMenu className="w-4 h-4" />
              {value.label}
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

export default ReorderSelectValueBtn;
