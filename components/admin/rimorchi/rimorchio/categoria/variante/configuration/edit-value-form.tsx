"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { ConfigurationValue, Image as ImageType } from "prisma/prisma-client";

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
  EditConfigurationValueSchema,
  EditConfigurationValueType,
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
import DeleteValueBtn from "./delete-value-btn";
import ReactQuillComponent from "@/components/admin/react-quill-component";

function EditValueForm({
  value,
  isDefault,
}: {
  value: ConfigurationValue;
  isDefault: boolean;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<EditConfigurationValueType>({
    resolver: zodResolver(EditConfigurationValueSchema),
    defaultValues: {
      value: value.value,
      prezzo: value.prezzo || 0,
      isFree: value.isFree,
      text: value.text || "",
      hasText: value.hasText,
    },
  });

  const onSubmit = async (data: EditConfigurationValueType) => {
    adminLoader.startLoading();
    await UpdateConfigurationValue(data, value.id).then((res) => {
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
    name: ["value", "isFree", "prezzo", "hasText", "text"],
  });

  useEffect(() => {
    const [
      watchedValue,
      watchedisFree,
      watchedPrezzo,
      watchedhasText,
      watchedText,
    ] = watchedFields;

    const isChanged =
      watchedValue !== value.value ||
      watchedisFree !== value.isFree ||
      watchedPrezzo !== value.prezzo ||
      watchedhasText !== value.hasText ||
      watchedText !== value.text;

    setIsModified(isChanged);
  }, [watchedFields, value]);

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
              name="value"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem
                  className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2`}
                  style={{ minHeight: "100%" }}
                >
                  <FormLabel>Gratis</FormLabel>
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(check) => field.onChange(check)}
                      />
                    </FormControl>
                    <FormDescription>
                      Attiva questa opzione se vuoi che questo valore sia gratis
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasText"
              render={({ field }) => (
                <FormItem
                  className={`relative rounded-md border border-input bg-transparent shadow px-4 py-2`}
                  style={{ minHeight: "100%" }}
                >
                  <FormLabel>Testo</FormLabel>
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(check) => field.onChange(check)}
                      />
                    </FormControl>
                    <FormDescription>
                      Attiva questa spunta se vuoi che la tua configurazione
                      abbia un testo da poter visualizzare nel preventivo
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {!form.getValues("isFree") && (
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
          )}

          {form.getValues("hasText") && (
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="mb-5 pb-12">
                  <FormLabel>Descrizione Sito</FormLabel>
                  <FormControl className="h-[100px] ">
                    <ReactQuillComponent
                      value={field.value || ""}
                      onChange={(value) => form.setValue("text", value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="flex md:flex-row gap-3 flex-col">
            <Button className="" type="submit" disabled={!isModified}>
              Salva modifiche
            </Button>
            {isDefault ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <DeleteValueBtn value={value} disabled />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={16}>
                    <p>
                      Non puoi cancellare il valore che è di predefinito alla
                      configurazione
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <DeleteValueBtn value={value} disabled={false} />
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditValueForm;
