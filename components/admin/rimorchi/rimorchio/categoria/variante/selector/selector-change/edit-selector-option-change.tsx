"use client";

import React, { useEffect, useState } from "react";
import { SelectorOptionChange, SelectorOption } from "prisma/prisma-client";
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
import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
  EditNewSelectorOptionChangeSchema,
  EditNewSelectorOptionChangeType,
} from "@/schemas/schema-trailer";
import { UpdateSelectorOptionChange } from "@/actions/trailer";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { MdEdit } from "react-icons/md";

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

function EditSelectorChangeBtn({
  selectorOptionChange,
  configurations,
}: {
  selectorOptionChange: SelectorOptionChange & {
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
  };
  configurations: AllConfigurations;
}) {
  const adminLoader = useAdminLoader();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [haveIf, setHaveIf] = useState(selectorOptionChange.haveIf);
  const [selectedConfiguration, setSelectedConfiguration] = useState<string>(
    selectorOptionChange.configurationId || ""
  );
  const [availableValues, setAvailableValues] = useState<ConfigurationValue2[]>(
    []
  );

  const form = useForm<EditNewSelectorOptionChangeType>({
    resolver: zodResolver(EditNewSelectorOptionChangeSchema),
    defaultValues: {
      haveIf: selectorOptionChange.haveIf,
      configurationId: selectorOptionChange.configurationId || undefined,
      checkType: selectorOptionChange.checkType,
      expectedValue: selectorOptionChange.expectedValue || undefined,
      change: selectorOptionChange.change.map((action) => ({
        configurationToChangeId: action.configurationToChangeId,
        newValueValue: action.newValueValue || "",
      })),
      elseChange: selectorOptionChange.elseChange.map((action) => ({
        configurationToChangeId: action.configurationToChangeId,
        newValueValue: action.newValueValue || "",
      })),
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

  const watchedFields = useWatch({
    control: form.control,
    name: [
      "haveIf",
      "configurationId",
      "checkType",
      "expectedValue",
      "change",
      "elseChange",
    ],
  });

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const [
      watchedHaveIf,
      watchedConfigurationId,
      watchedCheckType,
      watchedExpectedValue,
      watchedChange,
      watchedElseChange,
    ] = watchedFields;

    console.log("Watched Fields:", {
      watchedHaveIf,
      watchedConfigurationId,
      watchedCheckType,
      watchedExpectedValue,
      watchedChange,
      watchedElseChange,
    });

    const isChanged =
      watchedHaveIf !== selectorOptionChange.haveIf ||
      watchedConfigurationId !== selectorOptionChange.configurationId ||
      watchedCheckType !== selectorOptionChange.checkType ||
      watchedExpectedValue !== selectorOptionChange.expectedValue ||
      JSON.stringify(watchedChange) !==
        JSON.stringify(
          selectorOptionChange.change.map((action) => ({
            configurationToChangeId: action.configurationToChangeId,
            newValueValue: action.newValueValue || "",
          }))
        ) ||
      JSON.stringify(watchedElseChange) !==
        JSON.stringify(
          selectorOptionChange.elseChange.map((action) => ({
            configurationToChangeId: action.configurationToChangeId,
            newValueValue: action.newValueValue || "",
          }))
        );

    setIsModified(isChanged);
  }, [watchedFields, selectorOptionChange]);

  useEffect(() => {
    if (haveIf && selectedConfiguration) {
      const config = configurations?.find(
        (c) => c.id === selectedConfiguration
      );
      if (config) {
        setAvailableValues(config.values);
      }
    }
  }, [haveIf, selectedConfiguration, configurations]);

  const onSubmit = async (data: EditNewSelectorOptionChangeType) => {
    adminLoader.startLoading();

    await UpdateSelectorOptionChange(selectorOptionChange.id, data).then(
      (res) => {
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
            description: "Modifiche salvate con successo",
          });
          setIsDialogOpen(false);
          // window.location.reload();
        }
      }
    );
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
  };

  const getAvailableValues = (configurationId: string) => {
    const config = configurations?.find((c) => c.id === configurationId);
    return config ? config.values : [];
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="gap-x-2">
          <MdEdit className="w-4 h-4" />
          <span>Modifica</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[700px] sm:w-3/4 md:w-2/4">
        <DialogHeader>
          <DialogTitle>Modifica cambiamento</DialogTitle>
          <DialogDescription>
            Modifica il cambiamento esistente per l&apos;opzione selezionata
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
              disabled={!isModified} // Disabilita il bottone se non ci sono modifiche
            >
              Salva Modifiche
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSelectorChangeBtn;
