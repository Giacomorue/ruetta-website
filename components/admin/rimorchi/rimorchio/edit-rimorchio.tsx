"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Trailer, Image as ImageType } from "prisma/prisma-client";

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
import SelectImages from "../../select-images";
import { useRouter } from "next/navigation";
import { UpdateTrailer } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import ReactQuillComponent from "../../react-quill-component";

function EditRimorchio({
  trailer,
  images,
  socketId,
}: {
  trailer: Trailer;
  images: ImageType[] | null;
  socketId: string,
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<CreateNewTrailerType>({
    resolver: zodResolver(CreateNewTrailerSchema),
    defaultValues: {
      name: trailer.name,
      description: trailer.description || "",
      images: trailer.images,
      fornitore: trailer.fornitore,
      visible: trailer.visible,
    },
  });

  useEffect(() => {

    form.setValue("name", trailer.name);
    form.setValue("description", trailer.description??"");
    form.setValue("images", trailer.images);
    form.setValue("fornitore", trailer.fornitore);
    form.setValue("visible", trailer.visible);

  }, [trailer]);

  const onSubmit = async (data: CreateNewTrailerType) => {
    adminLoader.startLoading();
    await UpdateTrailer(data, trailer.id, socketId).then((res) => {
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
    name: ["name", "description", "images", "fornitore", "visible"],
  });

  useEffect(() => {
    const [
      watchedName,
      watchedDescription,
      watchedImages,
      watchedFornitore,
      watchedVisible,
    ] = watchedFields;

    const isChanged =
      watchedName !== trailer.name ||
      watchedDescription !== trailer.description ||
      JSON.stringify(watchedImages) !== JSON.stringify(trailer.images) ||
      watchedFornitore !== trailer.fornitore ||
      watchedVisible !== trailer.visible;

    setIsModified(isChanged);
  }, [watchedFields, trailer]);

  return (
    <div>
      <HeaderBar title={"Modifica " + trailer.name} subtitle />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>
                    Nome{" "}
                    {/* <span className="after:content-['*'] after:text-primary" /> */}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome rimorchio" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fornitore"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Fornitore</FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un fornitore" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Fornitori.map((fornitore) => (
                        <SelectItem key={fornitore.id} value={fornitore.id}>
                          {fornitore.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <FormItem className="rounded-md border border-input bg-transparent shadow px-4 py-2">
                <FormLabel>Visibile</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per rendere il rimorchio visibile
                    all&apos;interno del sito
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

export default EditRimorchio;
