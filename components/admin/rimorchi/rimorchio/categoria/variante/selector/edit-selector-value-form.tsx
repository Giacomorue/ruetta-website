"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { SelectorOption, Image as ImageType } from "prisma/prisma-client";

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

type SelectorOptionWithChanges = {
  id: string;
  label: string;
  valueOfConfigurationToRefer: string;
  visible: boolean;
  modalDescription: string;
  images: string[];
  order: number;
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
}: {
  images: ImageType[] | null;
  value: SelectorOptionWithChanges;
  configurationValueName: string;
  socketId: string;
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
    },
  });

  useEffect(() => {
    form.setValue("label", value.label);
    form.setValue("visible", value.visible);
    form.setValue("modalDescription", value.modalDescription || "");
    form.setValue("images", value.images);
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
    name: ["label", "visible", "images"],
  });

  useEffect(() => {
    const [watchedLabel, watchedVisible, watchedImages] = watchedFields;

    const isChanged =
      watchedLabel !== value.label ||
      watchedVisible !== value.visible ||
      JSON.stringify(watchedImages) !== JSON.stringify(value.images);

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
    !isQuillEmpty(form.watch("modalDescription") || "") && watchedImages
      ? watchedImages.length > 0
      : false
  );

  useEffect(() => {
    const descriptionIsEmpty = isQuillEmpty(
      form.watch("modalDescription") || ""
    );
    const hasImages = watchedImages ? watchedImages.length > 0 : false;

    if (form.watch("visible") && (descriptionIsEmpty || !hasImages)) {
      form.setValue("visible", false);
    }

    setCanChangeVisibility(!descriptionIsEmpty && hasImages);
  }, [form.watch("modalDescription"), form.watch("images")]);

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
    </div>
  );
}

export default EditSelectorValueForm;
