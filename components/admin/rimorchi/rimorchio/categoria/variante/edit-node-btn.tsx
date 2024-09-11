"use client";

import React, { useEffect, useState } from "react";
import { Node } from "prisma/prisma-client";
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
import { useForm, useWatch } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateNodeSchema, CreateNodeType } from "@/schemas/schema-trailer";
import { UpdateNode } from "@/actions/trailer";
import { NodeColumnType } from "./node-column";

function EditNodeBtn({
  node,
  isOpen,
  onClose,
  onRevalidate,
  socketId
}: {
  node: NodeColumnType;
  isOpen: boolean;
  onClose: () => void;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();

  const form = useForm<CreateNodeType>({
    resolver: zodResolver(CreateNodeSchema),
    defaultValues: {
      name: node.name,
      alwaysHidden: node.alwaysHidden,
    },
  });

  const onSubmit = async (data: CreateNodeType) => {
    adminLoader.startLoading();

    await UpdateNode(node.id, data, socketId).then((res) => {
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
          description: "Nodo aggiornato con successo",
        });
        onClose();
        onRevalidate();
      }
    });

    adminLoader.stopLoading();
  };

  const [isModified, setIsModified] = useState(false);

  const watchedFields = useWatch({
    control: form.control,
    name: ["name", "alwaysHidden"],
  });

  useEffect(() => {
    const [watchedName, watchedAlwaysHidden] = watchedFields;

    const isChanged =
      watchedName !== node.name || watchedAlwaysHidden !== node.alwaysHidden;

    setIsModified(isChanged);
  }, [watchedFields, node]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Modifica nodo</DialogTitle>
        </DialogHeader>
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
                      nascosto inizialmente, indipendentemente dalle
                      configurazioni
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button className="mt-3" type="submit" disabled={!isModified}>
              Aggiorna Nodo
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditNodeBtn;
