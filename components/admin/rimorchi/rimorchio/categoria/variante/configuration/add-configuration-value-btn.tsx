"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
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
} from "@/schemas/schema-trailer";
import {
  AddValuesToConfiguration,
  CreateConfiguration,
  CreateVariant,
} from "@/actions/trailer";

function AddValueToConfigurationBtn({
  configuration,
  trailerId,
  categoryId,
  variantId,
  socketId,
  onRevalidate
}: {
  configuration: Configuration;
  trailerId: string;
  categoryId: string;
  variantId: string;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<AddConfigurationValueType>({
    resolver: zodResolver(AddConfigurationValueSchema),
    defaultValues: {
      values: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "values" as never,
  });

  const onSubmit = async (data: AddConfigurationValueType) => {
    adminLoader.startLoading();
    console.log(data);
    await AddValuesToConfiguration(data, configuration.id, socketId).then((res) => {
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
        router.push(
          "/admin/rimorchi/" +
            trailerId +
            "/" +
            categoryId +
            "/" +
            variantId +
            "/configurazione/" +
            configuration.id
        );
        setIsDialogOpen(false);
        onRevalidate();
      }
    });
    adminLoader.stopLoading();
  };

  useEffect(() => {
    if (isDialogOpen) {
      form.reset();
      append("");
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
        <Button size={"lg"} className="gap-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi un valore</span>
        </Button>
      </>
    );
  }

  return (
    <div className="mt-3">
      <HeaderBar title={"Valori"} subtitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-x-2">
              <FaPlus className="w-4 h-4" />
              <span>Aggiungi un valore</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Aggiungi un valore</DialogTitle>
              <DialogDescription>
                Aggiungi un valore per la configurazione {configuration.name}
              </DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
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
                    Aggiungi valori
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

export default AddValueToConfigurationBtn;
