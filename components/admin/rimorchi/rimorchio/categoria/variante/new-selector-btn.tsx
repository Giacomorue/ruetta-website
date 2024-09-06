"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Variant } from "prisma/prisma-client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaGripVertical, FaPlus, FaTrash } from "react-icons/fa6";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  CreateNewConfigurationSchema,
  CreateNewConfigurationType,
  CreateNewSelectorSchema,
  CreateNewSelectorType,
  CreateNewVariantSchema,
  CreateNewVariantType,
} from "@/schemas/schema-trailer";
import {
  CreateConfiguration,
  CreateSelector,
  CreateVariant,
} from "@/actions/trailer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { ImMenu } from "react-icons/im";
import { MdMenu } from "react-icons/md";

interface ConfigurationValue {
  id: string;
  value: string;
  isFree: boolean;
  prezzo: number | null;
  hasText: boolean;
  text: string | null;
  configurationId: string;
}

// Definisci il tipo per Configuration
interface Configuration {
  id: string;
  name: string;
  defaultValue: string | null;
  createdAt: Date;
  updatedAt: Date;
  variantId: string;
  values: ConfigurationValue[];
}

// Definisci il tipo per l'array di Configuration o null
type AllConfigurations = Configuration[] | null;

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function NewSelectorBtn({
  variant,
  trailerId,
  configurations,
}: {
  variant: Variant;
  trailerId: string;
  configurations: AllConfigurations;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateNewSelectorType>({
    resolver: zodResolver(CreateNewSelectorSchema),
    defaultValues: {
      name: "",
      configurationToRefer: configurations?.at(0)?.id,
      values: [{ label: "", valueOfConfigurationToRefer: "" }],
    },
  });

  const { fields, append, remove, replace, update } = useFieldArray({
    control: form.control,
    name: "values",
  });

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  //   useEffect(() => {
  //     // Quando configurationToRefer cambia, rimuovi tutti i valori esistenti
  //     form.watch((value) => {
  //       if (value.configurationToRefer) {
  //         replace([{ label: "", valueOfConfigurationToRefer: "" }]);
  //         setSelectedValues([]);
  //       }
  //     });
  //   }, [form.watch("configurationToRefer")]);

  const handleSelectValue = (index: number, value: string) => {
    setSelectedValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  };

  const handleRemoveValue = (index: number) => {
    setSelectedValues((prev) => {
      const newValues = [...prev];
      newValues.splice(index, 1);
      return newValues;
    });
    remove(index);
  };

  const allValuesSelected =
    fields.length >=
    (configurations?.find(
      (c) => c.id === form.getValues("configurationToRefer")
    )?.values.length ?? 0);

  const onSubmit = async (data: CreateNewSelectorType) => {
    console.log(data);
    adminLoader.startLoading();
    console.log(data);
    await CreateSelector(data, variant.id).then((res) => {
      if (!res) return;
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      }

      if (res.selector) {
        toast({
          title: "Successo",
          description: "Selettore creato con successo",
        });
        router.push(
          "/admin/rimorchi/" +
            trailerId +
            "/" +
            variant.categoryId +
            "/" +
            variant.id +
            "/selector/" +
            res.selector.id
        );
      }
    });
    adminLoader.stopLoading();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  useEffect(() => {
    const selectedConfigurationId = form.watch("configurationToRefer");
    
    if (selectedConfigurationId) {
      const selectedConfiguration = configurations?.find(
        (config) => config.id === selectedConfigurationId
      );

      if(!selectedConfiguration) return;

      form.setValue("name", selectedConfiguration.name);
  
      if (selectedConfiguration) {
        const updatedValues = selectedConfiguration.values.map((configValue) => ({
          label: configValue.value, // Imposta la label al nome della configurazione
          valueOfConfigurationToRefer: configValue.id, // Imposta il valueOfConfigurationToRefer all'ID del valore
        }));
  
        replace(updatedValues);
        setSelectedValues(updatedValues.map((value) => value.valueOfConfigurationToRefer));
      }
    }
  }, [form.watch("configurationToRefer")]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <Button size={"lg"} className="gap-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Aggiungi un selettore</span>
        </Button>
      </>
    );
  }

  if (!configurations) {
    return (
      <HeaderBar title={"Selettori"} subtitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="gap-x-2" variant={"outline"} disabled>
                <FaPlus className="w-4 h-4" />
                <span>Aggiungi un selettore</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={16}>
              <p>
                Non puoi aggiungere un selettore perchè non ci sono
                configurazioni
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </HeaderBar>
    );
  }

  return (
    <div className="mt-5">
      <HeaderBar title={"Selettori"} subtitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {configurations && configurations?.length > 0 ? (
            <DialogTrigger asChild disabled={!configurations}>
              <Button className="gap-x-2" disabled={!configurations}>
                <FaPlus className="w-4 h-4" />
                <span>Aggiungi un selettore</span>
              </Button>
            </DialogTrigger>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button className="gap-x-2" variant={"outline"} disabled>
                    <FaPlus className="w-4 h-4" />
                    <span>Aggiungi un selettore</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={16}>
                  <p>
                    Non puoi aggiungere un selettore perchè non ci sono
                    configurazioni
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Aggiungi un selettore</DialogTitle>
              <DialogDescription>
                Crea qua un nuovo selettore per la variante {variant.name}
              </DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome selettore" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="configurationToRefer"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Configurazione di Riferimento</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              form.setValue("configurationToRefer", value);
                              // replace([
                              //   { label: "", valueOfConfigurationToRefer: "" },
                              // ]);
                              // setSelectedValues([]);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona configurazione" />
                            </SelectTrigger>
                            <SelectContent>
                              {configurations.map((config) => (
                                <SelectItem key={config.id} value={config.id}>
                                  {config.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Valori</FormLabel>
                    {fields.map((field, index) => (
                      <FormItem
                        key={field.id}
                        className="flex items-center space-x-3 mb-2"
                      >
                        <FormControl>
                          <Input
                            {...form.register(`values.${index}.label` as const)}
                            placeholder={`Valore ${index + 1}`}
                          />
                        </FormControl>
                        <FormControl>
                          <Controller
                            name={`values.${index}.valueOfConfigurationToRefer`}
                            control={form.control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  handleSelectValue(index, value);
                                  field.onChange(value);
                                }}
                              >
                                <SelectTrigger className="!mt-0">
                                  <SelectValue>
                                    {field.value
                                      ? configurations
                                          .find(
                                            (config) =>
                                              config.id ===
                                              form.getValues(
                                                "configurationToRefer"
                                              )
                                          )
                                          ?.values.find(
                                            (val) => val.id === field.value
                                          )?.value
                                      : "Seleziona valore"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {configurations
                                    .find(
                                      (config) =>
                                        config.id ===
                                        form.getValues("configurationToRefer")
                                    )
                                    ?.values.filter(
                                      (configValue) =>
                                        !selectedValues.includes(
                                          configValue.id
                                        ) || configValue.id === field.value
                                    )
                                    .map((configValue) => (
                                      <SelectItem
                                        key={configValue.id}
                                        value={configValue.id}
                                      >
                                        {configValue.value}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveValue(index)}
                          className="h-10 w-10 p-0"
                        >
                          <FaTrash />
                        </Button>
                      </FormItem>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        append({ label: "", valueOfConfigurationToRefer: "" })
                      }
                      className="mt-2"
                      disabled={allValuesSelected}
                    >
                      <FaPlus className="mr-2" /> Aggiungi valore
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Potrai aggiungere e modificare valori anche in seguito
                    </p>
                  </div>

                  <Button className="mt-3" type="submit">
                    Aggiungi Selettore
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </HeaderBar>
    </div>
  );
}

export default NewSelectorBtn;
