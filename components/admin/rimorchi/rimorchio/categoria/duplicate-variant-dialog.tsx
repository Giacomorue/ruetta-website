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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DuplicateVariant } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { disconnectPusher, getPusherClient } from "@/lib/pusherClient";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

export type CategoryType = {
  id: string;
  name: string;
};

export default function DuplicateVariantDialog({
  variantId,
  currentCategoryId,
  trailerId,
  open,
  onClose,
}: {
  variantId: string;
  currentCategoryId: string;
  trailerId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(currentCategoryId);
  const router = useRouter();
  const [socketId, setSocketId] = useState<string>("");

  const adminLoading = useAdminLoader();

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch("/api/category/trailer/" + trailerId, {
        cache: "no-cache",
      });
      const data = await response.json();

      setCategories(data.category);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    try {
      const response = await fetch("/api/category/trailer/" + trailerId, {
        cache: "no-cache",
      });
      const data = await response.json();

      setCategories(data.category);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
      router.push("/admin/rimorchi/404");
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
      fetchDataWithoutLoading();
    });

    return () => {
      channel.unbind("page-refresh");
      pusher.unsubscribe(`dashboard-channel`);
      disconnectPusher();
    };
  }, []);

  const onDuplicate = async () => {
    adminLoading.startLoading();
    try {
      await DuplicateVariant(variantId, selectedCategory, socketId).then(
        (res) => {
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

          if (res.newVariant) {
            toast({
              variant: "default",
              title: "Successo",
              description: "Variante duplicata con successo.",
            });
            router.push(
              `/admin/rimorchi/${trailerId}/${selectedCategory}/${res.newVariant.id}`
            );
            onClose();
          }
        }
      );
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
          <DialogTitle>Duplica Variante</DialogTitle>
          <DialogDescription>Scegli in che categoria vuoi dupliicare la variante</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Label>Categoria: </Label>
          <Select
            onValueChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona la categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories && categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
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
