"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Category } from "prisma/prisma-client";

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
  CreateNewVariantSchema,
  CreateNewVariantType,
} from "@/schemas/schema-trailer";
import { CreateVariant } from "@/actions/trailer";

function NewVariantBtn({ category }: { category: Category }) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateNewVariantType>({
    resolver: zodResolver(CreateNewVariantSchema),
    defaultValues: {
      name: "",
      prezzo: 0,
    },
  });

  const onSubmit = async (data: CreateNewVariantType) => {
    adminLoader.startLoading();
    await CreateVariant(data, category.id).then((res) => {
      if (!res) return;
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      }

      if (res.variant) {
        toast({
          title: "Successo",
          description: "Sottocategoria creata",
        });
        router.push(
          "/admin/rimorchi/" +
            category.trailerId +
            "/" +
            category.id +
            "/" +
            res.variant.id
        );
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
          <span>Aggiungi una variante</span>
        </Button>
      </>
    );
  }

  return (
    <div className="mt-3">
      <HeaderBar title="Varianti" subtitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-x-2">
              <FaPlus className="w-4 h-4" />
              <span>Aggiungi una variante</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Aggiungi una variante</DialogTitle>
              <DialogDescription>
                Crea qua una nuova variante per la sottocategoria{" "}
                {category.name}
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
                          <Input {...field} placeholder="Nome variante" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prezzo"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Prezzo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Prezzo"
                            type="number"
                            min="0"
                            onChange={(e) =>
                              form.setValue(
                                "prezzo",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="mt-3" type="submit">
                    Aggiungi variante
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

export default NewVariantBtn;
