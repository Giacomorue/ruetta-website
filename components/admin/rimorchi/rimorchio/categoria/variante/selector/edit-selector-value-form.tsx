"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import {
  SelectorOption,
  Image as ImageType,
  Selector,
} from "prisma/prisma-client";

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
  EditConfigurationValueSchema,
  EditConfigurationValueType,
  EditSelectorOptionSchema,
  EditSelectorOptionType,
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
  EditSelectorValue,
  UpdateCategory,
  UpdateConfigurationValue,
  UpdateTrailer,
  UpdateVariant,
} from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import SelectImages from "@/components/admin/select-images";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteSelectorValueBtn from "./delete-selector-value-btn";
import { CheckTypeChange } from "prisma/prisma-client";
import ReactQuillComponent from "@/components/admin/react-quill-component";
import Image from "next/image";
import { MdBlock } from "react-icons/md";

type SelectorOptionWithChanges = {
  id: string;
  label: string;
  valueOfConfigurationToRefer: string;
  visible: boolean;
  modalDescription: string;
  block: boolean;
  images: string[];
  order: number;
  colorCodePrincipal: string;
  hasSecondaryColor: boolean;
  colorCodeSecondary: string;
  createdAt: Date;
  updatedAt: Date;
  selectorId: string;
  selectorOptionChange: {
    id: string;
    haveIf: boolean;
    configurationId: string | null;
    checkType: CheckTypeChange;
    expectedValue: string | null;
    parentId: string | null;
    isFirstNode: boolean;
    ifRecId: string[];
    elseRecId: string[];
    createdAt: Date;
    updatedAt: Date;
    selectorOptionId: string;
    change: {
      id: string;
      configurationToChangeId: string;
      newValueValue: string | null;
      selectorOptionChangeId: string | null;
      selectorOptionElseChangeId: string | null;
    }[];
    elseChange: {
      id: string;
      configurationToChangeId: string;
      newValueValue: string | null;
      selectorOptionChangeId: string | null;
      selectorOptionElseChangeId: string | null;
    }[];
  }[];
};

function EditSelectorValueForm({
  images,
  value,
  configurationValueName,
  socketId,
  onRevalidate,
  selector,
}: {
  images: ImageType[] | null;
  value: SelectorOptionWithChanges;
  configurationValueName: string;
  socketId: string;
  selector: Selector;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<EditSelectorOptionType>({
    resolver: zodResolver(EditSelectorOptionSchema),
    defaultValues: {
      label: value.label,
      visible: value.visible,
      modalDescription: value.modalDescription || "",
      images: value.images,
      block: value.block,
      colorCodePrincipal: value.colorCodePrincipal,
      colorCodeSecondary: value.colorCodeSecondary,
      hasSecondaryColor: value.hasSecondaryColor,
    },
  });

  useEffect(() => {
    form.setValue("label", value.label);
    form.setValue("visible", value.visible);
    form.setValue("modalDescription", value.modalDescription || "");
    form.setValue("images", value.images);
    form.setValue("block", value.block);
    form.setValue("colorCodePrincipal", value.colorCodePrincipal);
    form.setValue("colorCodeSecondary", value.colorCodeSecondary);
    form.setValue("hasSecondaryColor", value.hasSecondaryColor);
  }, [value]);

  const onSubmit = async (data: EditSelectorOptionType) => {
    adminLoader.startLoading();
    console.log(data);
    await EditSelectorValue(data, value.id, socketId).then((res) => {
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
    name: [
      "label",
      "visible",
      "images",
      "modalDescription",
      "block",
      "colorCodePrincipal",
      "colorCodeSecondary",
      "hasSecondaryColor",
    ],
  });

  useEffect(() => {
    const [
      watchedLabel,
      watchedVisible,
      watchedImages,
      watchedDescription,
      watchedBlcok,
      watchedColorPrincipal,
      watchedColorSecondary,
      watchedHasSecondaryColor,
    ] = watchedFields;

    const isChanged =
      watchedLabel !== value.label ||
      watchedVisible !== value.visible ||
      JSON.stringify(watchedImages) !== JSON.stringify(value.images) ||
      watchedDescription !== value.modalDescription ||
      watchedBlcok !== value.block ||
      watchedColorPrincipal !== value.colorCodePrincipal ||
      watchedColorSecondary !== value.colorCodeSecondary ||
      watchedHasSecondaryColor !== value.hasSecondaryColor;

    setIsModified(isChanged);
  }, [watchedFields, value]);

  const isQuillEmpty = (value: string) => {
    if (typeof window === "undefined") return true;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = value;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.trim().length === 0;
  };

  const watchedImages = useWatch({
    control: form.control,
    name: "images",
  });

  const [canChangeVisibility, setCanChangeVisibility] = useState<boolean>(
    selector.isColorSelector
      ? true
      : !isQuillEmpty(form.watch("modalDescription") || "") && watchedImages
      ? watchedImages.length > 0
      : false
  );

  useEffect(() => {
    if (selector.isColorSelector) {
      setCanChangeVisibility(true);
      return;
    }

    const descriptionIsEmpty = isQuillEmpty(
      form.watch("modalDescription") || ""
    );
    const hasImages = watchedImages ? watchedImages.length > 0 : false;

    if (form.watch("visible") && (descriptionIsEmpty || !hasImages)) {
      form.setValue("visible", false);
    }

    setCanChangeVisibility(!descriptionIsEmpty && hasImages);
  }, [form.watch("modalDescription"), form.watch("images")]);

  console.log(form.watch("label").toLowerCase() === "no");

  const RenderColorPreview = () => {
    const primary = form.watch("colorCodePrincipal");
    const secondary = form.watch("colorCodeSecondary");

    return (
      <div className="flex items-center gap-4">
        {form.watch("hasSecondaryColor") ? (
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-4 py-2"
        >
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome valore" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1 w-full">
              <FormLabel>Valore configurazione</FormLabel>
              <Select disabled>
                <SelectTrigger disabled>
                  <SelectValue placeholder={configurationValueName} />
                </SelectTrigger>
              </Select>
            </div>
          </div>

          <div className="w-full">
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
                        checked={canChangeVisibility ? field.value : false}
                        onCheckedChange={(check) => {
                          if (canChangeVisibility) {
                            field.onChange(check);
                          }
                        }}
                        disabled={!canChangeVisibility}
                      />
                    </FormControl>
                    <FormDescription>
                      Attiva questa opzione se vuoi che questo valore sia
                      visibile.
                      <span className="text-primary font-medium">
                        (Puoi attivarla solo quando sono presenti immagini e una
                        descrizione)
                      </span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {!selector.isColorSelector && (
            <div className="w-full">
              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem
                    className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2 ${
                      canChangeVisibility
                        ? ""
                        : "after:w-full after:h-full after:bg-black/5 after:absolute after:top-0 after:left-0 cursor-not-allowed"
                    }`}
                    style={{ minHeight: "100%" }}
                  >
                    <FormLabel>Marchio bloccato</FormLabel>
                    <div className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(check) => {
                            if (canChangeVisibility) {
                              field.onChange(check);
                            }
                          }}
                          disabled={!canChangeVisibility}
                        />
                      </FormControl>
                      <FormDescription>
                        Attiva questa opzione se vuoi che questo valore sia
                        bloccato (lato grafico).
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {!selector.isColorSelector && (
            <FormField
              control={form.control}
              name="modalDescription"
              render={({ field }) => (
                <FormItem className="mb-5 pb-12">
                  <FormLabel>Descrizione Modal</FormLabel>
                  <FormControl className="h-[100px] ">
                    <ReactQuillComponent
                      value={field.value || ""}
                      onChange={(value) =>
                        form.setValue("modalDescription", value)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {!selector.isColorSelector && (
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
          )}

          {selector.isColorSelector && (
            <>
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
                {form.watch("hasSecondaryColor") && (
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
            </>
          )}

          <div className="flex md:flex-row gap-3 flex-col">
            <Button className="" type="submit" disabled={!isModified}>
              Salva modifiche
            </Button>
            <DeleteSelectorValueBtn
              value={value}
              disabled={false}
              socketId={socketId}
              onRevalidate={onRevalidate}
            />
          </div>
        </form>
      </Form>
      {selector.isColorSelector ? (
        <div className="my-3 px-4">
          <div
            className={`relative w-80 p-7 rounded-[10px] flex items-center justify-center cursor-pointer border ${"border-neutral-300"}`}
          >
            {/* <div className="w-[1px] h-full absolute top-0 left-1/2 -translate-x-1/2 bg-primary"></div> */}
            {/* Contenitore flessibile per il pallino e il testo */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-[18px]">
              <div className="flex items-center gap-3">
                {/* Usa gap molto piccolo */}
                {/* RenderColorPreview per creare il pallino di colore */}
                <RenderColorPreview />
                {/* Testo vicino al pallino */}
                <h3
                  className={`font-semibold max-w-[100px] truncate text-lg ${"text-neutral-800"}`}
                >
                  {form.watch("label")}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-3 px-4">
          {/* PREVIEW */}
          <HeaderBar subtitle title="Preview" />
          <div
            className={`relative rounded-[10px] shadow-lg cursor-pointer ${"bg-white outline-2 outline outline-muted-foreground hover:border-primary w-80"}`}
          >
            <div className="relative w-full h-[220px] mb-4 rounded-t-[10px] overflow-hidden">
              {form.watch("block") === true && (
                <div className="shrink-0 w-full h-full absolute top-0 left-0 z-50 bg-white/50 flex flex-col items-center justify-center">
                  <MdBlock className="w-28 h-28 text-secondary-foreground/70" />
                </div>
              )}
              <Image
                className="object-cover"
                src={form.watch("images")?.[0] ?? "/default-image.png"}
                alt={form.watch("label")}
                fill
              />
            </div>
            <div className="px-4 pb-4">
              <div className="z-20">
                <h3 className={`font-semibold text-lg ${""}`}>
                  {form.watch("label")}
                </h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: form.watch("modalDescription") ?? "",
                  }}
                  className={`text-sm line-clamp-3 max-h-[80px] min-h-[80px] ${"text-muted-foreground"}`}
                ></p>
              </div>
              <div className="mt-3">
                <span
                  className={`text-sm underline  transition-all duration-150 ${"text-muted-foreground hover:text-primary"}`}
                >
                  Maggiori informazioni
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditSelectorValueForm;
