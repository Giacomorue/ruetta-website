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
    },
  });

  useEffect(() => {
    form.setValue("name", selector.name);
    form.setValue("description", selector.description || "");
    form.setValue("visible", !canSetVisible ? false : selector.visible);
    form.setValue("isColorSelector", selector.isColorSelector || false);
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
    name: ["name", "description", "visible", "isColorSelector"],
  });

  useEffect(() => {
    const [watchedName, watchedDescription, watchedVisible, watchedIsColor] = watchedFields;

    let isChanged =
      watchedName !== selector.name ||
      watchedDescription !== selector.description ||
      watchedVisible !== selector.visible ||
      watchedIsColor!== selector.isColorSelector;

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

          <Button className="" type="submit" disabled={!isModified}>
            Salva modifiche
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EditSelectorForm;
