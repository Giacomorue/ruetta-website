"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Configuration, Image as ImageType, ConfigurationValue } from "prisma/prisma-client";

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
  EditConfigurationSchema,
  EditConfigurationType,
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
  UpdateConfiguration,
  UpdateTrailer,
  UpdateVariant,
} from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import SelectImages from "@/components/admin/select-images";

function EditConfiguration({
  configuration,
  values,
  onRevalidate,
  socketId,
}: {
  configuration: Configuration;
  values: ConfigurationValue[];
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();

  const form = useForm<EditConfigurationType>({
    resolver: zodResolver(EditConfigurationSchema),
    defaultValues: {
      name: configuration.name,
      defaultValue: configuration.defaultValue || "",
    },
  });

  useEffect(() => {
    form.setValue("name", configuration.name);
    form.setValue("defaultValue", configuration.defaultValue || "");
  }, [configuration]);

  const onSubmit = async (data: EditConfigurationType) => {
    adminLoader.startLoading();
    await UpdateConfiguration(data, configuration.id, socketId).then((res) => {
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

  const possibleDefaultValue = values.map((value) => ({
    id: value.id,
    label: value.value,
  }));

  const [isModified, setIsModified] = useState(false);

  const watchedFields = useWatch({
    control: form.control,
    name: ["name", "defaultValue"],
  });

  useEffect(() => {
    const [watchedName, watchedDefaultValue] = watchedFields;

    const isChanged =
      watchedName !== configuration.name ||
      watchedDefaultValue !== configuration.defaultValue;

    setIsModified(isChanged);
  }, [watchedFields, configuration]);

  return (
    <div>
      <HeaderBar
        title={"Modifica configurazione " + configuration.name}
        subtitle
      />
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
              name="defaultValue"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Valore Predefinito</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona valore" />
                      </SelectTrigger>
                      <SelectContent>
                        {possibleDefaultValue.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="" type="submit" disabled={!isModified}>
            Salva modifiche
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EditConfiguration;
