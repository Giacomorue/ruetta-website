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
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateNodeSchema, CreateNodeType } from "@/schemas/schema-trailer";
import { CreateNode } from "@/actions/trailer";

function NewNodeBtn({ variant, onRevalidate, socketId }: { variant: Variant, socketId: string, onRevalidate: () => void }) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateNodeType>({
    resolver: zodResolver(CreateNodeSchema),
    defaultValues: {
      name: "",
      alwaysHidden: false,
    },
  });

  const onSubmit = async (data: CreateNodeType) => {
    adminLoader.startLoading();

    await CreateNode(data, variant.id, socketId).then((res) => {
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
          description: "Nodo creato con successo",
        });
        setIsDialogOpen(false);
        onRevalidate();
        form.reset();
      }
    });

    adminLoader.stopLoading();
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
          <span>Aggiungi un nodo</span>
        </Button>
      </>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi un nodo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Aggiungi un nodo</DialogTitle>
          <DialogDescription>
            Crea un nuovo nodo per la variante {variant.name}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome nodo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alwaysHidden"
                render={({ field }) => (
                  <FormItem
                    className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2`}
                  >
                    <FormLabel>Nascosto</FormLabel>
                    <div className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(check) => field.onChange(check)}
                        />
                      </FormControl>
                      <FormDescription>
                        Attiva questa spunta se il nodo deve essere sempre
                        nascosto inizialmente, indipendente dalle configurazioni
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button className="mt-3" type="submit">
                Aggiungi Nodo
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default NewNodeBtn;
