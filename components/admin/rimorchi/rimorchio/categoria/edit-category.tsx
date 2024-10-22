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
  images,
  socketId,
  onRevalidate,
}: {
  category: Category;
  canChangeVisibility: boolean;
  socketId: string,
  onRevalidate: () => void,
  images: ImageType[]
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<CreateNewSottocategoriaType>({
    resolver: zodResolver(CreateNewSottocategoriaSchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
      visible: category.visible,
      images: category.images,
    },
  });

  useEffect(() => {

    form.setValue("name", category.name);
    form.setValue("description", category.description || "");
    form.setValue("visible", category.visible);

  }, [category])

  const onSubmit = async (data: CreateNewSottocategoriaType) => {
    adminLoader.startLoading();
    await UpdateCategory(data, category.id, socketId).then((res) => {
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
        // router.refresh();
        onRevalidate();
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
    name: ["name", "description", "visible", "images"],
  });

  useEffect(() => {
    const [watchedName, watchedDescription, watchedVisible, watchedImages] = watchedFields;

    const isChanged =
      watchedName !== category.name ||
      watchedDescription !== category.description ||
      JSON.stringify(watchedImages) !== JSON.stringify(category.images) ||
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

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="space-x-3 py-3">
                <FormLabel>Immagini</FormLabel>
                <FormControl className="ml-2">
                  <SelectImages
                    socketId={socketId}
                    images={images}
                    value={field.value || []}
                    onResetLinks={(array) => form.setValue("images", array)}
                    onSelectLink={(link) => {
                      const value = [...(field.value || []), link];
                      form.setValue("images", value);
                    }}
                    onDeselectLink={(link) => {
                      const value = [
                        ...(field.value?.filter((l) => l !== link) || []),
                      ];
                      form.setValue("images", value);
                    }}
                  />
                </FormControl>
                <div>
                  {field.value?.length !== 0 ? (
                    <div className="flex flex-row items-center flex-wrap gap-2">
                      {field.value?.map((image) => (
                        <div
                          key={image}
                          className="h-36 w-36 relative group rounded-xl overflow-hidden"
                        >
                          <ImageL
                            className="object-contain"
                            fill
                            src={image || ""}
                            alt={"Img"}
                          />
                          <Button
                            className="w-full h-full absolute top-0 left-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-100"
                            onClick={() => {
                              const value = [
                                ...(field.value?.filter((l) => l !== image) ||
                                  []),
                              ];
                              form.setValue("images", value);
                            }}
                          >
                            <FaTrash className="w-10 h-10 text-white" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nessuna immagine selezionata
                    </p>
                  )}
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
