"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Variant, Image as ImageType } from "prisma/prisma-client";

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
  CreateNewVariantSchema,
  CreateNewVariantType,
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
import {
  UpdateCategory,
  UpdateTrailer,
  UpdateVariant,
} from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import SelectImages from "@/components/admin/select-images";
import ReactQuillComponent from "@/components/admin/react-quill-component";
import Select3DModel from "./color/select-3d-model";

function EditVariant({
  variant,
  images,
  canSet3DModel,
  canSetConfigurabile,
  onRevalidate,
  socketId,
}: {
  variant: Variant;
  images: ImageType[] | null;
  canSetConfigurabile: boolean;
  canSet3DModel: boolean;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<CreateNewVariantType>({
    resolver: zodResolver(CreateNewVariantSchema),
    defaultValues: {
      name: variant.name,
      prezzo: variant.prezzo,
      description: variant.description || "",
      nomePrev: variant.nomePrev,
      descriptionPrev: variant.descriptionPrev,
      images: variant.images,
      visible: variant.visible,
      configurable: canSetConfigurabile ? variant.configurable : false,
      has3DModel: variant.has3DModel,
      cameraInitialPositionX: variant.initialCameraPosition.x || -20,
      cameraInitialPositionY: variant.initialCameraPosition.y || 10,
      cameraInitialPositionZ: variant.initialCameraPosition.z || 40,
      fileUrl: variant.fileUrl || "",
    },
  });

  useEffect(() => {
    form.setValue("name", variant.name);
    form.setValue("prezzo", variant.prezzo);
    form.setValue("description", variant.description || "");
    form.setValue("descriptionPrev", variant.descriptionPrev);
    form.setValue("images", variant.images);
    form.setValue("visible", variant.visible);
    form.setValue(
      "configurable",
      canSetConfigurabile ? variant.configurable : false
    );
    form.setValue("has3DModel", variant.has3DModel);
    form.setValue(
      "cameraInitialPositionX",
      variant.initialCameraPosition.x || -20
    );
    form.setValue(
      "cameraInitialPositionY",
      variant.initialCameraPosition.y || 10
    );
    form.setValue(
      "cameraInitialPositionZ",
      variant.initialCameraPosition.z || 40
    );
    form.setValue("nomePrev", variant.nomePrev);
    form.setValue("fileUrl", variant.fileUrl);
  }, [variant]);

  const onSubmit = async (data: CreateNewVariantType) => {
    adminLoader.startLoading();
    await UpdateVariant(data, variant.id, socketId).then((res) => {
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
    name: [
      "name",
      "prezzo",
      "description",
      "descriptionPrev",
      "images",
      "visible",
      "configurable",
      "has3DModel",
      "cameraInitialPositionX",
      "cameraInitialPositionY",
      "cameraInitialPositionZ",
      "nomePrev",
      "fileUrl",
    ],
  });

  useEffect(() => {
    const [
      watchedName,
      watchedPrezzo,
      watchedDescription,
      watchedDescriptionPrev,
      watchedImages,
      watchedVisible,
      watchedConfigurable,
      watchedHas3DModel,
      watchedCameraInitialPositionX,
      watchedCameraInitialPositionY,
      watchedCameraInitialPositionZ,
      watchedNomePrev,
      watchedFileUrl,
    ] = watchedFields;

    let isChanged =
      watchedName !== variant.name ||
      watchedPrezzo !== variant.prezzo ||
      watchedDescription !== variant.description ||
      watchedDescriptionPrev !== variant.descriptionPrev ||
      JSON.stringify(watchedImages) !== JSON.stringify(variant.images) ||
      watchedVisible !== variant.visible ||
      watchedHas3DModel !== variant.has3DModel ||
      watchedCameraInitialPositionX !== variant.initialCameraPosition.x ||
      watchedCameraInitialPositionY !== variant.initialCameraPosition.y ||
      watchedCameraInitialPositionZ !== variant.initialCameraPosition.z ||
      watchedNomePrev !== variant.nomePrev ||
      watchedFileUrl !== variant.fileUrl;

    if (canSetConfigurabile) {
      isChanged = isChanged || watchedConfigurable !== variant.configurable;
    }

    setIsModified(isChanged);
  }, [watchedFields, variant]);

  return (
    <div>
      <HeaderBar title={"Modifica variante " + variant.name} subtitle />
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
            <FormField
              control={form.control}
              name="prezzo"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Prezzo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Prezzo"
                      type="number"
                      min="0"
                      onChange={(e) =>
                        form.setValue("prezzo", parseFloat(e.target.value))
                      }
                    />
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
                <FormLabel>Descrizione Sito</FormLabel>
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
            name="nomePrev"
            render={({ field }) => (
              <FormItem className="mb-5 pb-12">
                <FormLabel>Nome Preventivo</FormLabel>
                <FormControl className="h-[100px] ">
                  <ReactQuillComponent
                    value={field.value || ""}
                    onChange={(value) => form.setValue("nomePrev", value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descriptionPrev"
            render={({ field }) => (
              <FormItem className="mb-5 pb-12">
                <FormLabel>Descrizione Preventivo</FormLabel>
                <FormControl className="h-[100px] ">
                  <ReactQuillComponent
                    value={field.value || ""}
                    onChange={(value) =>
                      form.setValue("descriptionPrev", value)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <FormField
              control={form.control}
              name="configurable"
              render={({ field }) => (
                <FormItem
                  className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2 ${
                    canSetConfigurabile
                      ? ""
                      : "after:w-full after:h-full after:bg-black/5 after:absolute after:top-0 after:left-0 cursor-not-allowed"
                  }`}
                  style={{ minHeight: "100%" }}
                >
                  <FormLabel>Configurabile</FormLabel>
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={!canSetConfigurabile ? false : field.value}
                        onCheckedChange={(check) => field.onChange(check)}
                        disabled={!canSetConfigurabile}
                      />
                    </FormControl>
                    <FormDescription>
                      Attiva questa spunta per rendere la variante configurabile
                      all&apos;interno del sito{" "}
                      <span className="text-primary font-medium">
                        (puoi rendere configurabile quando c&apos;è almeno un
                        selettore)
                      </span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="has3DModel"
              render={({ field }) => (
                <FormItem
                  className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2 ${
                    form.watch("fileUrl") !== ""
                      ? ""
                      : "after:w-full after:h-full after:bg-black/5 after:absolute after:top-0 after:left-0 cursor-not-allowed"
                  }`}
                  style={{ minHeight: "100%" }}
                >
                  <FormLabel>Modelli 3D</FormLabel>
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(check) => field.onChange(check)}
                        disabled={form.watch("fileUrl") === ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Attiva questa spunta per abilitare i modelli 3D per questa
                      variante, altrimenti verranno usate le immagini{" "}
                      <span className="text-primary font-medium">
                        (Può essere attivata solo se è configurabile e se sono
                        inseriti i nodi e i modelli 3D nei vari colori visibili)
                      </span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormItem
                className={`rounded-md border border-input bg-transparent shadow px-4 py-2 mb-10`}
              >
                <FormLabel>Visibile</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                      //   disabled={!canChangeVisibility}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per rendere il rimorchio visibile
                    all&apos;interno del sito{" "}
                    {/* <span className="text-primary font-medium">
                      (puoi rendere visibile solo quando almeno una variante è
                      visibile)
                    </span> */}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem className="space-x-3 py-3">
                <FormLabel>Modello 3D</FormLabel>
                <FormControl>
                  <Select3DModel
                    value={field.value || ""}
                    onSelectModel={(link) => {
                      form.setValue("fileUrl", link);
                      if (link === "") {
                        if (form.watch("has3DModel") === true) {
                          form.setValue("has3DModel", false);
                        }
                      }
                    }}
                  />
                </FormControl>
                <div className="mt-2">
                  {field.value !== "" ? (
                    <p className="text-sm text-muted-foreground flex flex-row items-center gap-2">
                      <span>Modello selezionato: {field.value}</span>
                      <Button
                        onClick={() => {
                          form.setValue("fileUrl", "");
                          if (form.watch("has3DModel") === true) {
                            form.setValue("has3DModel", false);
                          }
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nessun modello selezionato
                    </p>
                  )}
                </div>
              </FormItem>
            )}
          />

          {form.watch("has3DModel") && (
            <div>
              <FormLabel>Posizione iniziale della camera</FormLabel>
              <div className="flex flex-col items-center md:flex-row gap-3 h-full pt-1">
                <FormField
                  control={form.control}
                  name="cameraInitialPositionX"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 w-full h-full">
                      <FormLabel>X:</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="X"
                          type="number"
                          onChange={(e) =>
                            form.setValue(
                              "cameraInitialPositionX",
                              parseFloat(e.target.value)
                            )
                          }
                          className="!mt-0 !pt-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cameraInitialPositionY"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 w-full">
                      <FormLabel>Y:</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="X"
                          type="number"
                          onChange={(e) =>
                            form.setValue(
                              "cameraInitialPositionY",
                              parseFloat(e.target.value)
                            )
                          }
                          className="!mt-0 !pt-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cameraInitialPositionZ"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 w-full">
                      <FormLabel>Z:</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="X"
                          type="number"
                          onChange={(e) =>
                            form.setValue(
                              "cameraInitialPositionZ",
                              parseFloat(e.target.value)
                            )
                          }
                          className="!mt-0 !pt-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

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

          <Button className="" type="submit" disabled={!isModified}>
            Salva modifiche
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EditVariant;
