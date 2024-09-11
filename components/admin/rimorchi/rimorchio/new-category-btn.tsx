"use client";

import React from "react";
import HeaderBar from "../../header-bar";
import { Trailer } from "prisma/prisma-client";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  CreateNewSottocategoriaSchema,
  CreateNewSottocategoriaType,
} from "@/schemas/schema-trailer";
import { CreateCategory } from "@/actions/trailer";

function NewCategoryBtn({ trailer, socketId, }: { trailer: Trailer, socketId: string }) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateNewSottocategoriaType>({
    resolver: zodResolver(CreateNewSottocategoriaSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateNewSottocategoriaType) => {
    adminLoader.startLoading();
    await CreateCategory(data, trailer.id, socketId).then((res) => {
      if (!res) return;
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      }

      if (res.category) {
        toast({
          title: "Successo",
          description: "Sottocategoria creata",
        });
        router.push("/admin/rimorchi/" + trailer.id + "/" + res.category.id);
      }
    });
    adminLoader.stopLoading();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <Button size={"lg"} className="gap-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi una sottocategoria</span>
        </Button>
      </>
    );
  }

  return (
    <div className="mt-3">
      <HeaderBar title="Sottocategorie" subtitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-x-2">
              <FaPlus className="w-4 h-4" />
              <span>Aggiungi una sottocategoria</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Aggiungi una sottocategoria</DialogTitle>
              <DialogDescription>
                Crea qua una nuova sottocategoria per il rimorchio{" "}
                {trailer.name}
              </DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Nome </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome sottocategoria" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="mt-3" type="submit">
                    Aggiungi Sottocategoria
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </HeaderBar>
    </div>
  );
}

export default NewCategoryBtn;
