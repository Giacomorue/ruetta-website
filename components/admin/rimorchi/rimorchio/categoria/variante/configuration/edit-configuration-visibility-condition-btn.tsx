"use client";

import React from "react";
import { ConfigurationVisibilityCondition } from "prisma/prisma-client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { toast } from "@/components/ui/use-toast";
import {
  EditConfigurationVisibilityConditionSchema,
  EditConfigurationVisibilityConditionType,
} from "@/schemas/schema-trailer";
import { EditConfigurationVisibilityCondition } from "@/actions/trailer";
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
import { MdEdit } from "react-icons/md";

// Tipi specificati nel file precedente
interface ConfigurationValue {
  id: string;
  value: string;
  isFree: boolean;
  prezzo: number | null;
  hasText: boolean;
  text: string | null;
  configurationId: string;
}

interface Configuration {
  id: string;
  name: string;
  defaultValue: string | null;
  createdAt: Date;
  updatedAt: Date;
  variantId: string;
  values: ConfigurationValue[];
}

type AllConfigurations = Configuration[] | null;

import { Configuration as ConfigurationType } from "prisma/prisma-client";

function EditConfigurationVisibilityConditionBtn({
  configuration,
  configurations,
  visibilityCondition,
  onRevalidate,
  socketId
}: {
  configuration: ConfigurationType;
  configurations: AllConfigurations;
  visibilityCondition: ConfigurationVisibilityCondition;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<EditConfigurationVisibilityConditionType>({
    resolver: zodResolver(EditConfigurationVisibilityConditionSchema),
    defaultValues: {
      configurationId: visibilityCondition.configurationId,
      expectedValue: visibilityCondition.expectedValue,
      checkType: visibilityCondition.checkType,
      elseVisible: visibilityCondition.elseVisible,
      ifVisible: visibilityCondition.ifVisible,
    },
  });

  useEffect(() => {
    form.setValue("configurationId", visibilityCondition.configurationId);
    form.setValue("expectedValue", visibilityCondition.expectedValue);
    form.setValue("checkType", visibilityCondition.checkType);
    form.setValue("elseVisible", visibilityCondition.elseVisible);
    form.setValue("ifVisible", visibilityCondition.ifVisible);
  }, [visibilityCondition]);

  const onSubmit = async (data: EditConfigurationVisibilityConditionType) => {
    adminLoader.startLoading();

    await EditConfigurationVisibilityCondition(
      visibilityCondition.id,
      data,
      socketId
    ).then((res) => {
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
            Modifica una condizione di visibilità per la configurazione{" "}
            {configuration.name}
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

export default EditConfigurationVisibilityConditionBtn;
