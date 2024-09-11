"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Variant } from "prisma/prisma-client";

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
import { useFieldArray, useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  CreateNewConfigurationSchema,
  CreateNewConfigurationType,
  CreateNewVariantSchema,
  CreateNewVariantType,
} from "@/schemas/schema-trailer";
import { CreateConfiguration, CreateVariant } from "@/actions/trailer";

function NewConfiguration({
  variant,
  trailerId,
  socketId,
}: {
  variant: Variant;
  trailerId: string;
  socketId: string,
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateNewConfigurationType>({
    resolver: zodResolver(CreateNewConfigurationSchema),
    defaultValues: {
      name: "",
      values: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // name: "values",
    name: "values" as never,
  });

  const onSubmit = async (data: CreateNewConfigurationType) => {
    adminLoader.startLoading();
    console.log(data);
    await CreateConfiguration(data, variant.id, socketId).then((res) => {
      if (!res) return;
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      }

      if (res.configuration) {
        toast({
          title: "Successo",
          description: "Configurazione creata",
        });
        router.push(
          "/admin/rimorchi/" +
            trailerId +
            "/" +
            variant.categoryId +
            "/" +
            variant.id +
            "/configurazione/" +
            res.configuration.id
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
          <span>Aggiungi una configurazione</span>
        </Button>
      </>
    );
  }

  return (
    <div className="mt-3">
      <HeaderBar title={"Configurazioni"} subtitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-x-2">
              <FaPlus className="w-4 h-4" />
              <span>Aggiungi una configurazione</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Aggiungi una configurazione</DialogTitle>
              <DialogDescription>
                Crea qua una nuova configurazione per la variante {variant.name}
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
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome configurazione" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel>Valori</FormLabel>
                    {fields.map((field, index) => (
                      <FormItem
                        key={field.id}
                        className="flex items-center space-x-3"
                      >
                        <FormControl>
                          <Input
                            {...form.register(`values.${index}` as const)}
                            placeholder={`Valore ${index + 1}`}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                          className="h-10 w-10 p-0"
                        >
                          <FaTrash />
                        </Button>
                      </FormItem>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => append("")}
                      className="mt-2"
                    >
                      <FaPlus className="mr-2" /> Aggiungi valore
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Potrai aggiungere e modificare valori anche in seguito
                    </p>
                  </div>
                  <Button className="mt-3" type="submit">
                    Aggiungi Configurazione
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

export default NewConfiguration;
