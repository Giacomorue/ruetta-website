"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Category, Image as ImageType } from "prisma/prisma-client";

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
import { useForm, useWatch } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { Image } from "prisma/prisma-client";
// import SelectLogo from "./select-logo";
import ImageL from "next/image";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import {
  CreateNewSottocategoriaSchema,
  CreateNewSottocategoriaType,
  CreateNewTrailerSchema,
  CreateNewTrailerType,
} from "@/schemas/schema-trailer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fornitori } from "@/constants";

import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import { UpdateCategory, UpdateTrailer } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import SelectImages from "@/components/admin/select-images";
import ReactQuillComponent from "@/components/admin/react-quill-component";

function EditCategory({
  category,
  canChangeVisibility,
}: {
  category: Category;
  canChangeVisibility: boolean;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<CreateNewSottocategoriaType>({
    resolver: zodResolver(CreateNewSottocategoriaSchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
      visible: category.visible,
    },
  });

  const onSubmit = async (data: CreateNewSottocategoriaType) => {
    adminLoader.startLoading();
    await UpdateCategory(data, category.id).then((res) => {
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
          variant: "default",
          title: "Successo",
          description: "Modifiche avvenute con succecsso",
        });
        router.refresh();
      }
    });
    adminLoader.stopLoading();
  };

  const modules = {
    toolbar: [
      //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const [isModified, setIsModified] = useState(false);

  const watchedFields = useWatch({
    control: form.control,
    name: ["name", "description", "visible"],
  });

  useEffect(() => {
    const [watchedName, watchedDescription, watchedVisible] = watchedFields;

    const isChanged =
      watchedName !== category.name ||
      watchedDescription !== category.description ||
      watchedVisible !== category.visible;

    setIsModified(isChanged);
  }, [watchedFields, category]);

  return (
    <div>
      <HeaderBar title={"Modifica sottocategoria " + category.name} subtitle />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Nome </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome categoria" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mb-5 pb-12">
                <FormLabel>Descrizione</FormLabel>
                <FormControl className="h-[100px] ">
                  <ReactQuillComponent
                    value={field.value || ""}
                    onChange={(value) => form.setValue("description", value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormItem
                className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2 ${
                  canChangeVisibility
                    ? ""
                    : "after:w-full after:h-full after:bg-black/5 after:absolute after:top-0 after:left-0 cursor-not-allowed"
                }`}
              >
                <FormLabel>Visibile</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                      disabled={!canChangeVisibility}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per rendere il rimorchio visibile
                    all&apos;interno del sito{" "}
                    <span className="text-primary font-medium">
                      (puoi rendere visibile solo quando almeno una variante è
                      visibile)
                    </span>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button className="mt-3" type="submit" disabled={!isModified}>
            Salva modifiche
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EditCategory;
