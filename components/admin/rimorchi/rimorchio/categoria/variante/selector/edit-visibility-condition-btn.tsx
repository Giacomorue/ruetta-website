"use client";

import React from "react";
import HeaderBar from "@/components/admin/header-bar";
import { Selector, SelectorVisibilityCondition } from "prisma/prisma-client";

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
import { FaGripVertical, FaTrash } from "react-icons/fa6";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  AddNewVisibilityConditionSchema,
  AddNewVisibilityConditionType,
  CreateNewConfigurationSchema,
  CreateNewConfigurationType,
  CreateNewSelectorSchema,
  CreateNewSelectorType,
  CreateNewVariantSchema,
  CreateNewVariantType,
  EditVisibilityConditionSchema,
  EditVisibilityConditionType,
} from "@/schemas/schema-trailer";
import {
  CreateANewVisibilityCondition,
  CreateConfiguration,
  CreateSelector,
  CreateVariant,
  EditVisibilityCondition,
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
  SelectGroup,
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
import { MdEdit, MdMenu } from "react-icons/md";

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

function EditVisibilityConditionBtn({
  selector,
  configurations,
  visibilityCondition,
  socketId,
  onRevalidate,
}: {
  selector: Selector;
  configurations: AllConfigurations;
  visibilityCondition: SelectorVisibilityCondition;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<EditVisibilityConditionType>({
    resolver: zodResolver(EditVisibilityConditionSchema),
    defaultValues: {
      configurationId: visibilityCondition.configurationId,
      expectedValue: visibilityCondition.expectedValue,
      checkType: visibilityCondition.checkType,
      elseVisible: visibilityCondition.elseVisible,
      ifVisible: visibilityCondition.ifVisible,
    },
  });

  const onSubmit = async (data: EditVisibilityConditionType) => {
    console.log(data);
    adminLoader.startLoading();
    console.log(data);
    await EditVisibilityCondition(visibilityCondition.id, data, socketId).then((res) => {
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
          title: "Successo",
          description: "Condizione di visibilità modificata con successo",
        });
        setIsDialogOpen(false);
        onRevalidate();
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

  const [selectedConfiguration, setSelectedConfiguration] =
    useState<string>("");
  const [availableValues, setAvailableValues] = useState<
    { id: string; value: string }[]
  >([]);

  const handleConfigurationChange = (value: string) => {
    if (!configurations) return;
    setSelectedConfiguration(value);
    const config = configurations.find((c) => c.id === value);
    if (config) {
      setAvailableValues(
        config.values.map((v) => ({ id: v.id, value: v.value }))
      );
    } else {
      setAvailableValues([]);
    }

    form.setValue("expectedValue", "");
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Imposta la configurazione selezionata al valore predefinito quando il dialog viene aperto
    if (visibilityCondition.configurationId) {
      setSelectedConfiguration(visibilityCondition.configurationId);

      const config = configurations?.find(
        (c) => c.id === visibilityCondition.configurationId
      );

      if (config) {
        setAvailableValues(
          config.values.map((v) => ({ id: v.id, value: v.value }))
        );
      }
    }
  }, [visibilityCondition.configurationId, configurations]);

  if (!isClient) {
    return (
      <>
        <Button size={"lg"} className="gap-x-2">
          <MdEdit className="w-4 h-4" />
          <span>Modifica la condizione di visibilità</span>
        </Button>
      </>
    );
  }

  if (!configurations) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button className="gap-x-2" variant={"outline"} disabled>
              <MdEdit className="w-4 h-4" />
              <span>Modifica la condizione di visibilità</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={16}>
            <p>
              Non puoi aggiungere una condizione di visibilità se non ci sono
              altre configurazioni
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {configurations && configurations?.length > 0 ? (
        <DialogTrigger asChild disabled={!configurations}>
          <Button
            className="gap-x-2"
            disabled={!configurations}
            variant={"outline"}
          >
            <MdEdit className="w-4 h-4" />
            <span>Modifica la condizione di visibilità</span>
          </Button>
        </DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="gap-x-2" variant={"outline"} disabled>
                <MdEdit className="w-4 h-4" />
                <span>Modifica la condizione di visibilità</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={16}>
              <p>
                Non puoi aggiungere una condizione di visibilità se non ci sono
                altre configurazioni
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Modifica la condizione di visibilità</DialogTitle>
          <DialogDescription>
            Modifica una condizione di visibilità per il selettore{" "}
            {selector.name}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="configurationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configurazione</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleConfigurationChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una configurazione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {configurations.map((config) => (
                              <SelectItem key={config.id} value={config.id}>
                                {config.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo di Controllo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona il tipo di controllo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="EQUAL">Uguale</SelectItem>
                            <SelectItem value="NOTEQUAL">Diverso</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valore Atteso</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un valore">
                            {field.value
                              ? availableValues.find(
                                  (a) => a.id === field.value
                                )?.value
                              : "Seleziona un valore"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {availableValues.map((value) => (
                              <SelectItem key={value.id} value={value.id}>
                                {value.value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifVisible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mostra se è vero</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          // Converti il valore stringa in un booleano
                          const booleanValue = value === "true";
                          field.onChange(booleanValue);
                        }}
                        value={field.value === true ? "true" : "false"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un valore"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="true">Si</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="elseVisible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mostra se è falso</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          // Converti il valore stringa in un booleano
                          const booleanValue = value === "true";
                          field.onChange(booleanValue);
                        }}
                        value={field.value === true ? "true" : "false"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un valore"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="true">Si</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="mt-3" type="submit">
                Modifica la condizione
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditVisibilityConditionBtn;
