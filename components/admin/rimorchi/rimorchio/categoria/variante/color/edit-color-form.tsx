"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdateColorSchema, UpdateColorType } from "@/schemas/schema-trailer";
import { Colors } from "prisma/prisma-client";
import HeaderBar from "@/components/admin/header-bar";
import "react-quill/dist/quill.snow.css";
import { FaPlus, FaTrash } from "react-icons/fa6";
import SelectImages from "@/components/admin/select-images";
import { Variant, Image as ImageType } from "prisma/prisma-client";
import ImageL from "next/image";
import Select3DModel from "./select-3d-model";
import ReactQuillComponent from "@/components/admin/react-quill-component";
import { UpdateColor } from "@/actions/trailer";

function EditColorForm({
  color,
  variantId,
  images,
}: {
  color: Colors; // Assumi che Color sia il tipo corretto dal tuo modello Prisma
  variantId: string;
  images: ImageType[] | null;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const [canSet3DModel, setCanSet3DModel] = useState(
    color.fileUrl === null ? false : color.fileUrl !== "" && color.visible
  );

  const form = useForm<UpdateColorType>({
    resolver: zodResolver(UpdateColorSchema),
    defaultValues: {
      name: color.name,
      description: color.description,
      price: color.price,
      fileUrl: color.fileUrl,
      visible: color.visible,
      has3DModel: color.has3DModel,
      colorCodePrincipal: color.colorCodePrincipal,
      colorCodeSecondary: color.colorCodeSecondary,
      images: color.images,
      hasSecondaryColor: color.hasSecondaryColor,
    },
  });

  const onSubmit = async (data: UpdateColorType) => {
    adminLoader.startLoading();
    // Assumi che esista una funzione chiamata UpdateColor
    await UpdateColor(data, color.id).then((res) => {
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
          description: "Colore aggiornato con successo",
        });
        router.refresh();
      }
    });
    adminLoader.stopLoading();
  };

  const [isModified, setIsModified] = useState(false);
  const [hasSecondaryColor, setHasSecondaryColor] = useState<Boolean>(
    color.hasSecondaryColor
  );

  const watchedFields = useWatch({
    control: form.control,
    name: [
      "name",
      "description",
      "price",
      "fileUrl",
      "visible",
      "has3DModel",
      "colorCodePrincipal",
      "colorCodeSecondary",
      "images",
      "hasSecondaryColor",
    ],
  });

  useEffect(() => {
    const [
      watchedName,
      watchedDescription,
      watchedPrice,
      watchedFileUrl,
      watchedVisible,
      watchedHas3DModel,
      watchedColorCodePrincipal,
      watchedColorCodeSecondary,
      watchedImages,
      watchedHasSecondaryColor,
    ] = watchedFields;

    let isChanged =
      watchedName !== color.name ||
      watchedDescription !== color.description ||
      watchedPrice !== color.price ||
      watchedFileUrl !== color.fileUrl ||
      watchedVisible !== color.visible ||
      watchedHas3DModel !== color.has3DModel ||
      watchedColorCodePrincipal !== color.colorCodePrincipal ||
      watchedColorCodeSecondary !== color.colorCodeSecondary ||
      JSON.stringify(watchedImages) !== JSON.stringify(color.images) ||
      watchedHasSecondaryColor !== color.hasSecondaryColor;

    setIsModified(isChanged);
  }, [watchedFields, color]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colorCodeSecondaries" as never, // path to the array in the form
  });

  const isQuillEmpty = (value: string) => {
    if (typeof window === "undefined") return true;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = value;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.trim().length === 0;
  };

  const watchedDescription = useWatch({
    control: form.control,
    name: "description",
  });

  const watchedImages = useWatch({
    control: form.control,
    name: "images",
  });

  const [canChangeVisibility, setCanChangeVisibility] = useState<Boolean>(
    !isQuillEmpty(watchedDescription || "") && watchedImages
      ? watchedImages.length > 0
      : false
  );

  useEffect(() => {
    const descriptionIsEmpty = isQuillEmpty(watchedDescription || "");
    const hasImages = watchedImages ? watchedImages.length > 0 : false;

    if (canChangeVisibility && form.watch("visible") === true) {
      if ((!descriptionIsEmpty && hasImages) === false) {
        form.setValue("visible", false);
      }
    }

    setCanChangeVisibility(!descriptionIsEmpty && hasImages);
  }, [watchedDescription, watchedImages]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setCanSet3DModel(
      form.watch("fileUrl") !== "" && form.watch("visible") === true
    );

    if((form.watch("fileUrl") !== "" && form.watch("visible") === true) === false){
      form.setValue("has3DModel", false);
    }
  }, [form.watch("fileUrl"), form.watch("visible")]);

  useEffect(() => {
    setIsClient(true); // Quando il componente è montato, siamo sul client
  }, []);

  if (!isClient) return null;

  const RenderColorPreview = () => {
    const primary = form.watch("colorCodePrincipal");
    const secondary = form.watch("colorCodeSecondary");

    return (
      <div className="flex items-center gap-4">
        {hasSecondaryColor ? (
          <div
            className="relative w-10 h-10 rounded-full border border-border"
            style={{
              background: `linear-gradient(200deg, ${primary} 50%, ${secondary} 50%)`, // Gradiente con transizione morbida
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Effetto di luce nella parte superiore */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
                maskImage:
                  "radial-gradient(circle, black 60%, transparent 70%)",
              }}
            />
          </div>
        ) : (
          <div
            className="relative w-10 h-10 rounded-full border border-border"
            style={{
              backgroundColor: primary,
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Effetto di luce nella parte superiore */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
                maskImage:
                  "radial-gradient(circle, black 60%, transparent 70%)",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <HeaderBar title={"Modifica colore " + color.name} subtitle />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome del colore" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
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
                        form.setValue("price", parseFloat(e.target.value))
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
                <FormLabel>Descrizione</FormLabel>
                <FormControl className="h-[100px] ">
                  <ReactQuillComponent
                    onChange={(value) => {
                      form.setValue("description", value);
                      console.log("Description changed:", value);
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasSecondaryColor"
            render={({ field }) => (
              <FormItem
                className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2 }`}
                style={{ minHeight: "100%" }}
              >
                <FormLabel>Colore secondario</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      onCheckedChange={(check) => {
                        field.onChange(check);
                        setHasSecondaryColor(Boolean(check));
                      }}
                      checked={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per attivare il colore secondario
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="colorCodePrincipal"
              render={({ field }) => (
                <FormItem className="space-y-1 pb-3 w-full">
                  <FormLabel>Colore Principale</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {/* Pallino che mostra il colore selezionato */}
                      {/* <div
                        className="w-8 h-8 rounded-full border border-border"
                        style={{ backgroundColor: field.value }}
                      /> */}
                      {/* Input per selezionare il colore */}
                      <Input
                        type="color"
                        {...field}
                        placeholder="#ffffff"
                        maxLength={7}
                        className="h-10 bg-transparent p-0 cursor-pointer w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hasSecondaryColor && (
              <FormField
                control={form.control}
                name="colorCodeSecondary"
                render={({ field }) => (
                  <FormItem className="space-y-1 pb-3 w-full">
                    <FormLabel>Colore Secondario</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        {/* Pallino che mostra il colore selezionato */}
                        {/* <div
                          className="w-8 h-8 rounded-full border border-border"
                          style={{ backgroundColor: field.value }}
                        /> */}
                        {/* Input per selezionare il colore */}
                        <Input
                          type="color"
                          {...field}
                          placeholder="#ffffff"
                          maxLength={7}
                          className="h-10 bg-transparent p-0 cursor-pointer w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="mx-3">
              <FormLabel>Anteprima</FormLabel>
              <RenderColorPreview />
            </div>
          </div>

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
                      setCanSet3DModel(link !== "");
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
                          setCanSet3DModel(false);
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

          <FormField
            control={form.control}
            name="has3DModel"
            render={({ field }) => (
              <FormItem
                className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2 ${
                  canSet3DModel
                    ? ""
                    : "after:w-full after:h-full after:bg-black/5 after:absolute after:top-0 after:left-0 cursor-not-allowed"
                }`}
                style={{ minHeight: "100%" }}
              >
                <FormLabel>Modello 3D</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={!canSet3DModel ? false : field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                      disabled={!canSet3DModel}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per far si che il colore abbia la
                    possibilità di usare il modello 3D{" "}
                    <span className="text-primary font-medium">
                      (Puoi attivarla solo quando è stato caricato un modello 3D
                      e il colore è visibile)
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
                style={{ minHeight: "100%" }}
              >
                <FormLabel>Visibile</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={!canChangeVisibility ? false : field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                      disabled={!canChangeVisibility}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per far si che il colore sia visibile
                    nel configuratore{" "}
                    <span className="text-primary font-medium">
                      (Puoi attivarla solo quando ci sono delle immagini e una
                      descrizione)
                    </span>
                  </FormDescription>
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

export default EditColorForm;
