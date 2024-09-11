"use client";

import { SelectorOption } from "prisma/prisma-client";
import React, { useState } from "react";
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
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { toast } from "@/components/ui/use-toast";
import {
  AddNewSelectorOptionChangeSchema,
  AddNewSelectorOptionChangeType,
} from "@/schemas/schema-trailer";
import { CreateSelectorOptionChange } from "@/actions/trailer";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";

interface ConfigurationValue2 {
  id: string;
  value: string;
  isFree: boolean;
  prezzo: number | null;
  hasText: boolean;
  text: string | null;
  configurationId: string;
}

interface Configuration2 {
  id: string;
  name: string;
  defaultValue: string | null;
  createdAt: Date;
  updatedAt: Date;
  variantId: string;
  values: ConfigurationValue2[];
}

type AllConfigurations = Configuration2[] | null;

function NewSelectorChangeBtn({
  selectorOption,
  configurations,
  parentId,
  isFirstNode,
  isIfRec,
  isElseRec,
  onRevalidate,
  socketId
}: {
  selectorOption: SelectorOption;
  configurations: AllConfigurations;
  parentId: string;
  isFirstNode: boolean;
  isIfRec: boolean;
  isElseRec: boolean;
  socketId: string;
  onRevalidate: () => void;
}) {
  const adminLoader = useAdminLoader();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [haveIf, setHaveIf] = useState(false);
  const [selectedConfiguration, setSelectedConfiguration] =
    useState<string>("");
  const [availableValues, setAvailableValues] = useState<ConfigurationValue2[]>(
    []
  );

  const form = useForm<AddNewSelectorOptionChangeType>({
    resolver: zodResolver(AddNewSelectorOptionChangeSchema),
    defaultValues: {
      haveIf: false,
      configurationId: undefined,
      checkType: "EQUAL",
      expectedValue: undefined,
      change: [],
      elseChange: [],
      isFirstNode,
      parentId,
      isElseRec,
      isIfRec,
    },
  });

  const {
    fields: changeFields,
    append: changeAppend,
    remove: changeRemove,
  } = useFieldArray({
    control: form.control,
    name: "change",
  });

  const {
    fields: elseFields,
    append: elseAppend,
    remove: elseRemove,
  } = useFieldArray({
    control: form.control,
    name: "elseChange",
  });

  const [triggerRender, setTriggerRender] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: AddNewSelectorOptionChangeType) => {
    adminLoader.startLoading();
    // console.log("Submitting form", data);
    console.log(form.formState.errors);
    await CreateSelectorOptionChange(selectorOption.id, data, socketId).then((res) => {
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
          description:
            "Cambiamento dell'opzione selettore aggiunto con successo",
        });
        setIsDialogOpen(false);
        form.reset();
        onRevalidate();
        // router.refresh();
        // window.location.reload();
      }
    });
    adminLoader.stopLoading();
  };

  const handleConfigurationChange = (value: string) => {
    setSelectedConfiguration(value);
    const config = configurations?.find((c) => c.id === value);
    if (config) {
      setAvailableValues(config.values);
    } else {
      setAvailableValues([]);
    }
    form.setValue("expectedValue", "");
  };

  const handleConfigurationSetChange = (
    index: number,
    value: string,
    type: "change" | "elseChange"
  ) => {
    const config = configurations?.find((c) => c.id === value);
    if (config) {
      if (type === "change") {
        form.setValue(`change.${index}.configurationToChangeId`, value);
        form.setValue(`change.${index}.newValueValue`, ""); // Reset newValueValue when configuration changes
      } else if (type === "elseChange") {
        form.setValue(`elseChange.${index}.configurationToChangeId`, value);
        form.setValue(`elseChange.${index}.newValueValue`, ""); // Reset newValueValue when configuration changes
      }
    }

    setTriggerRender(!triggerRender);
  };

  const getAvailableValues = (configurationId: string) => {
    const config = configurations?.find((c) => c.id === configurationId);
    return config ? config.values : [];
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <FaPlus className="w-4 h-4" />
          Aggiungi Cambiamento
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[700px] sm:w-3/4 md:w-2/4">
        <DialogHeader>
          <DialogTitle>
            Aggiungi un nuovo cambiamento per l&apos;opzione{" "}
            {selectorOption.label}
          </DialogTitle>
          <DialogDescription>
            Configura un nuovo cambiamento per l&apos;opzione selezionata
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="haveIf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Struttura Condizionale (If/Else)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const booleanValue = value === "true";
                        field.onChange(booleanValue);
                        setHaveIf(booleanValue);

                        // Svuota elseChange se stiamo disattivando il condizionale
                        if (!booleanValue) {
                          elseFields.forEach((_, index) => elseRemove(index));
                          form.setValue("configurationId", undefined);
                          form.setValue("expectedValue", undefined);
                        }
                      }}
                      value={field.value ? "true" : "false"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un'opzione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Sì</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {haveIf && (
              <>
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
                          defaultValue={field.value ?? ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona una configurazione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {configurations?.map((config) => (
                                <SelectItem key={config.id} value={config.id}>
                                  {config.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
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
                                    (v) => v.id === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="space-y-4">
              <FormLabel>Cambiamenti</FormLabel>
              {changeFields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name={`change.${index}.configurationToChangeId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              handleConfigurationSetChange(
                                index,
                                value,
                                "change"
                              );
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona una configurazione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {configurations?.map((config) => (
                                  <SelectItem key={config.id} value={config.id}>
                                    {config.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`change.${index}.newValueValue`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona un valore">
                                {field.value
                                  ? getAvailableValues(
                                      form.getValues(
                                        `change.${index}.configurationToChangeId`
                                      )
                                    ).find((v) => v.id === field.value)?.value
                                  : "Seleziona un valore"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {getAvailableValues(
                                  form.getValues(
                                    `change.${index}.configurationToChangeId`
                                  )
                                ).map((value) => (
                                  <SelectItem key={value.id} value={value.id}>
                                    {value.value}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => changeRemove(index)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  changeAppend({
                    configurationToChangeId: "",
                    newValueValue: "",
                  })
                }
                className="mt-2 flex items-center"
              >
                <FaPlus className="mr-2" />
                Aggiungi Cambiamento
              </Button>

              {form.formState.errors.change && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.change.message}
                </p>
              )}
              {form.formState.errors.checkType && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.checkType.message}
                </p>
              )}
              {form.formState.errors.configurationId && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.configurationId.message}
                </p>
              )}
              {form.formState.errors.expectedValue && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.expectedValue.message}
                </p>
              )}
            </div>

            {haveIf && (
              <div className="space-y-4">
                <FormLabel>Cambiamenti Else</FormLabel>
                {elseFields.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name={`elseChange.${index}.configurationToChangeId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                handleConfigurationSetChange(
                                  index,
                                  value,
                                  "elseChange"
                                );
                                field.onChange(value);
                              }}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona una configurazione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {configurations?.map((config) => (
                                    <SelectItem
                                      key={config.id}
                                      value={config.id}
                                    >
                                      {config.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`elseChange.${index}.newValueValue`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona un valore">
                                  {field.value
                                    ? getAvailableValues(
                                        form.getValues(
                                          `elseChange.${index}.configurationToChangeId`
                                        )
                                      ).find((v) => v.id === field.value)?.value
                                    : "Seleziona un valore"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {getAvailableValues(
                                    form.getValues(
                                      `elseChange.${index}.configurationToChangeId`
                                    )
                                  ).map((value) => (
                                    <SelectItem key={value.id} value={value.id}>
                                      {value.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => elseRemove(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    elseAppend({
                      configurationToChangeId: "",
                      newValueValue: "",
                    })
                  }
                  className="mt-2 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Aggiungi Cambiamento Else
                </Button>
              </div>
            )}

            <Button
              className="mt-4"
              type="submit"
              onClick={() => console.log(form.formState.isValid)}
            >
              Aggiungi il Cambiamento
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewSelectorChangeBtn;
