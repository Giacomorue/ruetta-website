"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import {
  Selector,
  Image as ImageType,
  Configuration,
  ConfigurationValue,
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
  EditSelectorSchema,
  EditSelectorType,
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
  EditSelector,
  UpdateCategory,
  UpdateTrailer,
  UpdateVariant,
} from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import SelectImages from "@/components/admin/select-images";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import ReactQuillComponent from "@/components/admin/react-quill-component";

function EditSelectorForm({
  selector,
  canSetVisible,
  selectorOprtionValueText,
  configurations,
  onRevalidate,
  socketId,
  images,
}: {
  selector: Selector;
  canSetVisible: boolean;
  selectorOprtionValueText: string;
  configurations: ({
    values: {
      id: string;
      value: string;
      isFree: boolean;
      prezzo: number | null;
      hasText: boolean;
      textBig: string | null;
      textLittle: string | null;
      configurationId: string;
    }[];
  } & {
    id: string;
    name: string;
    defaultValue: string | null;
    createdAt: Date;
    updatedAt: Date;
    variantId: string;
  })[];
  socketId: string;
  onRevalidate: () => void;
  images: ImageType[] | null;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<EditSelectorType>({
    resolver: zodResolver(EditSelectorSchema),
    defaultValues: {
      name: selector.name,
      description: selector.description || "",
      visible: !canSetVisible ? false : selector.visible,
      isColorSelector: selector.isColorSelector || false,
      moreInfoModal: selector.moreInfoModal || false,
      moreInfoDescription: selector.moreInfoDescription || "",
      moreInfoImages: selector.moreInfoImages || [],
    },
  });

  useEffect(() => {
    form.setValue("name", selector.name);
    form.setValue("description", selector.description || "");
    form.setValue("visible", !canSetVisible ? false : selector.visible);
    form.setValue("isColorSelector", selector.isColorSelector || false);
    form.setValue("moreInfoModal", selector.moreInfoModal);
    form.setValue("moreInfoDescription", selector.moreInfoDescription || "");
    form.setValue("moreInfoImages", selector.moreInfoImages || []);
  }, [selector]);

  useEffect(() => {
    if (canSetVisible === false) {
      form.setValue("visible", false);
    }
  }, [canSetVisible]);

  const onSubmit = async (data: EditSelectorType) => {
    adminLoader.startLoading();
    await EditSelector(data, selector.id, socketId).then((res) => {
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
      "name",
      "description",
      "visible",
      "isColorSelector",
      "moreInfoModal",
      "moreInfoDescription",
      "moreInfoImages",
    ],
  });

  useEffect(() => {
    const [
      watchedName,
      watchedDescription,
      watchedVisible,
      watchedIsColor,
      watchedMoreInfoModal,
      watchedMoreInfoDescription,
      watchedMoreInfoImages,
    ] = watchedFields;

    let isChanged =
      watchedName !== selector.name ||
      watchedDescription !== selector.description ||
      watchedVisible !== selector.visible ||
      watchedIsColor !== selector.isColorSelector ||
      watchedMoreInfoModal !== selector.moreInfoModal ||
      watchedMoreInfoDescription !== selector.moreInfoDescription ||
      JSON.stringify(watchedMoreInfoImages) !==
        JSON.stringify(selector.moreInfoImages);

    setIsModified(isChanged);
  }, [watchedFields, selector]);

  return (
    <div>
      <HeaderBar title={"Modifica selettore " + selector.name} subtitle />
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
            <div className="w-full space-y-1">
              <FormLabel>Configurazione</FormLabel>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder={selectorOprtionValueText} />
                </SelectTrigger>
              </Select>
            </div>
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
            name="visible"
            render={({ field }) => (
              <FormItem
                className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2 ${
                  canSetVisible
                    ? ""
                    : "after:w-full after:h-full after:bg-black/5 after:absolute after:top-0 after:left-0 cursor-not-allowed"
                }`}
              >
                <FormLabel>Visibile</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={!canSetVisible ? false : field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                      disabled={!canSetVisible}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per rendere il rimorchio visibile
                    all&apos;interno del sito{" "}
                    <span className="text-primary font-medium">
                      (puoi rendere visibile solo quando almeno un valore del
                      selettore è visibile)
                    </span>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isColorSelector"
            render={({ field }) => (
              <FormItem
                className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2`}
              >
                <FormLabel>Colore</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa sunta per rendere questo selettore un colore{" "}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moreInfoModal"
            render={({ field }) => (
              <FormItem
                className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2`}
              >
                <FormLabel>Più informazioni Modal</FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(check) => field.onChange(check)}
                    />
                  </FormControl>
                  <FormDescription>
                    Attiva questa spunta per attivare il modal &quot;Maggiori
                    informazioni&quot; all&apos;interno del selettore{" "}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.watch("moreInfoModal") && (
            <>
              <FormField
                control={form.control}
                name="moreInfoDescription"
                render={({ field }) => (
                  <FormItem className="mb-5 pb-12">
                    <FormLabel>Descrizione Modal</FormLabel>
                    <FormControl className="h-[100px] ">
                      <ReactQuillComponent
                        value={field.value || ""}
                        onChange={(value) =>
                          form.setValue("moreInfoDescription", value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moreInfoImages"
                render={({ field }) => (
                  <FormItem className="space-x-3 py-3">
                    <FormLabel>Immagini</FormLabel>
                    <FormControl className="ml-2">
                      <SelectImages
                        socketId={socketId}
                        images={images}
                        value={field.value || []}
                        onResetLinks={(array) =>
                          form.setValue("moreInfoImages", array)
                        }
                        onSelectLink={(link) => {
                          const value = [...(field.value || []), link];
                          form.setValue("moreInfoImages", value);
                        }}
                        onDeselectLink={(link) => {
                          const value = [
                            ...(field.value?.filter((l) => l !== link) || []),
                          ];
                          form.setValue("moreInfoImages", value);
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
                                    ...(field.value?.filter(
                                      (l) => l !== image
                                    ) || []),
                                  ];
                                  form.setValue("moreInfoImages", value);
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
            </>
          )}

          <Button className="" type="submit" disabled={!isModified}>
            Salva modifiche
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EditSelectorForm;
