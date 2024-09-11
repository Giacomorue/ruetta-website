"use client";

import React, { useEffect, useState } from "react";
import { Configuration } from "prisma/prisma-client";
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
import { ReorderConfigurations } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";

function ReorderConfigurationsBtn({
  configurations,
  variantId,
  disabled,
  socketId,
  onRevalidate
}: {
  configurations: Configuration[];
  variantId: string;
  disabled: boolean;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const [ordersConfiguration, setOrdersConfiguration] =
    useState(configurations);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrdersConfiguration(configurations);
    }
  }, [isOpen]);

  const onSave = async () => {
    adminLoader.startLoading();
    await ReorderConfigurations(ordersConfiguration, variantId, socketId).then((res) => {
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
          description: "Configurazioni riordinate con successo",
        });
        setIsOpen(false);
        onRevalidate();
      }
    });
    adminLoader.stopLoading();
  };

  const isOrderChanged =
    JSON.stringify(configurations) !== JSON.stringify(ordersConfiguration);

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
          Modifica ordine
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica l&apos;ordine delle configurazioni</DialogTitle>
          <DialogDescription>
            Modifica l&apos;ordine delle configurazioni per scegliere come
            saranno visualizzate nel preventivo.
          </DialogDescription>
        </DialogHeader>
        <Reorder.Group
          axis="y"
          values={ordersConfiguration}
          onReorder={setOrdersConfiguration}
          className="flex flex-col items-center w-full gap-4 py-4"
        >
          {ordersConfiguration.map((config) => (
            <Reorder.Item
              value={config}
              key={config.id}
              className="rounded-xl border border-input bg-transparent px-3 py-2 text-lg shadow-sm transition-colors w-full font-medium cursor-grab flex flex-row items-center gap-3"
            >
              <MdMenu className="w-4 h-4" />
              {config.name}
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

export default ReorderConfigurationsBtn;
