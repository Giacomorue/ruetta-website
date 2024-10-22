"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DuplicateConfiguration, DuplicateConfigurationToVariant } from "@/actions/trailer"; // Assicurati che la tua funzione per duplicare la configurazione sia importata correttamente
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";
import { Label } from "@/components/ui/label";

export type VariantType = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
};

export default function DuplicateConfigurationToVariantDialog({
  configurationId,
  currentVariantId,
  trailerId,
  open,
  onClose,
}: {
  configurationId: string;
  currentVariantId: string;
  trailerId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const router = useRouter();
  const [socketId, setSocketId] = useState<string>("");

  const adminLoading = useAdminLoader();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch(
        `/api/trailer/${trailerId}/category/variant`,
        {
          cache: "no-cache",
        }
      );
      const data = await response.json();

      setVariants(data.variants);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
    } finally {
      adminLoading.stopLoading();
    }
  };

  useEffect(() => {
    fetchData();

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`dashboard-channel`);

    pusher.connection.bind("connected", () => {
      const id = pusher.connection.socket_id;
      setSocketId(id);
    });

    channel.bind("page-refresh", async (data: any) => {
      fetchData();
    });

    return () => {
      channel.unbind("page-refresh");
      pusher.unsubscribe(`dashboard-channel`);
      disconnectPusher();
    };
  }, []);

  const onDuplicate = async () => {
    if (!selectedVariant) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Seleziona una variante di destinazione.",
      });
      return;
    }

    adminLoading.startLoading();
    try {
      await DuplicateConfigurationToVariant(
        configurationId,
        selectedVariant,
        socketId
      ).then((res) => {
        if (!res) {
          return;
        }

        if (res.error) {
          toast({
            variant: "destructive",
            title: "Errore",
            description: res.error,
          });
          return;
        }

        if (res.newConfig) {
          toast({
            variant: "default",
            title: "Successo",
            description: "Configurazione duplicata con successo.",
          });
          router.push(
            `/admin/rimorchi/${trailerId}/${res.newConfig.variant.categoryId}/${res.newConfig.variantId}`
          );
          onClose();
        }
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante la duplicazione.",
      });
    } finally {
      adminLoading.stopLoading();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplica Configurazione</DialogTitle>
          <DialogDescription>
            Scegli in quale variante vuoi duplicare la configurazione
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Label>Variante di destinazione:</Label>
          <Select
            onValueChange={(value) => setSelectedVariant(value)}
            value={selectedVariant}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona la variante di destinazione" />
            </SelectTrigger>
            <SelectContent>
              {variants &&
                variants
                  .filter((variant) => variant.id !== currentVariantId)
                  .reduce((acc, variant) => {
                    const categoryIndex = acc.findIndex(
                      (group) => group.categoryId === variant.category.id
                    );
                    if (categoryIndex === -1) {
                      acc.push({
                        categoryId: variant.category.id,
                        categoryName: variant.category.name,
                        variants: [variant],
                      });
                    } else {
                      acc[categoryIndex].variants.push(variant);
                    }
                    return acc;
                  }, [] as { categoryId: string; categoryName: string; variants: VariantType[] }[])
                  .map((group) => (
                    <SelectGroup key={group.categoryId}>
                      <SelectLabel>{group.categoryName}</SelectLabel>
                      {group.variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={onDuplicate}>Duplica</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
