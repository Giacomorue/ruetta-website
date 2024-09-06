"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Selector, ConfigurationValue } from "prisma/prisma-client";

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
  AddConfigurationValueSchema,
  AddConfigurationValueType,
  AddSelectorOptionSchema,
  AddSelectorOptionType,
} from "@/schemas/schema-trailer";
import {
  AddSelectorOption,
  AddValuesToConfiguration,
  CreateConfiguration,
  CreateVariant,
} from "@/actions/trailer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AddSelectorValueBtn({
  canAdd,
  selector,
  canSetThisOptionValue,
  trailerId,
  categoryId,
  variantId,
}: {
  canAdd: boolean;
  selector: Selector;
  canSetThisOptionValue: ConfigurationValue[];
  trailerId: string;
  categoryId: string;
  variantId: string;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<AddSelectorOptionType>({
    resolver: zodResolver(AddSelectorOptionSchema),
    defaultValues: {
      label: "",
      valueOfConfigurationToRefer: "",
    },
  });

  const onSubmit = async (data: AddSelectorOptionType) => {
    adminLoader.startLoading();
    console.log(data);
    await AddSelectorOption(data, selector.id).then((res) => {
      if (!res) return;
      form.reset();
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
        setIsDialogOpen(false);
      }
    });
    adminLoader.stopLoading();
  };

  useEffect(() => {
    if (isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen]);

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
        <Button disabled={!canAdd} size={"lg"} className="gap-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi un&apos;opzione</span>
        </Button>
      </>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild disabled={!canAdd}>
        <Button className="gap-x-2" disabled={!canAdd}>
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi un&apos;opzione</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Aggiungi un valore</DialogTitle>
          <DialogDescription>
            Aggiungi un valore per il selettore {selector.name}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome opzione" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valueOfConfigurationToRefer"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Valore della configurazione</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona configurazione" />
                        </SelectTrigger>
                        <SelectContent>
                          {canSetThisOptionValue.map((config) => (
                            <SelectItem key={config.id} value={config.id}>
                              {config.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-3" type="submit">
                Aggiungi un valore
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddSelectorValueBtn;
