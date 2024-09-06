"use client";

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "@/components/ui/use-toast";
import {
  AddNewConfigurationChangeSchema,
  AddNewConfigurationChangeType,
  ConfigurationChangeActionSchema,
  ConfigurationChangeActionType,
} from "@/schemas/schema-trailer";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { CreateConfigurationChange } from "@/actions/trailer";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

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

interface Node {
  id: string;
  name: string;
}

type AllConfigurations = Configuration2[] | null;
type AllNodes = Node[] | null;

function NewConfigurationChangeBtn({
  configurations,
  nodes,
  parentId,
  isFirstNode,
  isIfRec,
  isElseRec,
  configurationValue,
  isElse,
}: {
  configurationValue: ConfigurationValue2;
  configurations: AllConfigurations;
  nodes: AllNodes;
  parentId: string;
  isFirstNode: boolean;
  isIfRec: boolean;
  isElseRec: boolean;
  isElse: boolean;
}) {
  const adminLoader = useAdminLoader();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedConfiguration, setSelectedConfiguration] =
    useState<string>("");
  const [availableValues, setAvailableValues] = useState<ConfigurationValue2[]>(
    []
  );
  const [haveIf, setHaveIf] = useState(false);
  const [isElseChangeState, setIsElseChangeState] = useState(false);

  const form1 = useForm<AddNewConfigurationChangeType>({
    resolver: zodResolver(AddNewConfigurationChangeSchema),
    defaultValues: {
      haveIf: false,
      configurationId: undefined,
      checkType: "EQUAL",
      expectedValue: undefined,
      change: [],
      elseChange: [],
      isFirstNode: isFirstNode,
      parentId: parentId,
      isElseRec: isElseRec,
      isIfRec: isIfRec,
      isElse: isElse,
    },
  });

  const {
    fields: changeFields,
    append: changeAppend,
    remove: changeRemove,
    update: changeUpdate,
  } = useFieldArray({
    control: form1.control,
    name: "change",
  });

  const {
    fields: elseChangeFields,
    append: elseChangeAppend,
    remove: elseChangeRemove,
    update: elseChangeUpdate,
  } = useFieldArray({
    control: form1.control,
    name: "elseChange",
  });

  const router = useRouter();

  const form2 = useForm<ConfigurationChangeActionType>({
    resolver: zodResolver(ConfigurationChangeActionSchema),
    defaultValues: {
      nodeId: "",
      visible: false,
      changePosition: false,
      changeScale: false,
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 0, y: 0, z: 0 },
    },
  });

  const onSubmit = async (data: AddNewConfigurationChangeType) => {
    adminLoader.startLoading();
    await CreateConfigurationChange(configurationValue.id, data).then((res) => {
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
          description: "Cambiamento di configurazione aggiunto con successo",
        });
        setIsDialogOpen(false);
        form1.reset();
        setHaveIf(false);
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
    form1.setValue("expectedValue", "");
  };

  const handleAddChange = () => {
    setEditingIndex(null);
    setIsChangeDialogOpen(true);
  };

  const handleEditChange = (index: number, isElseChange: boolean) => {
    setEditingIndex(index);

    const changeData = isElseChange
      ? elseChangeFields[index]
      : changeFields[index];
    form2.reset(changeData);

    setIsChangeDialogOpen(true);
  };

  const handleSaveChange = (data: ConfigurationChangeActionType) => {
    if (editingIndex !== null) {
      if (isElseChangeState) {
        elseChangeUpdate(editingIndex, data);
      } else {
        changeUpdate(editingIndex, data);
      }
    } else {
      if (isElseChangeState) {
        elseChangeAppend(data);
      } else {
        changeAppend(data);
      }
    }
    setIsChangeDialogOpen(false);
    form2.reset();
  };

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleRemoveChange = (index: number, isElseChange: boolean) => {
    if (isElseChange) {
      elseChangeRemove(index);
    } else {
      changeRemove(index);
    }
  };

  return (
    <>
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
              Aggiungi un nuovo cambiamento per la configurazione
            </DialogTitle>
            <DialogDescription>
              Configura un nuovo cambiamento per la configurazione selezionata
            </DialogDescription>
          </DialogHeader>
          <Form {...form1}>
            <form onSubmit={form1.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form1.control}
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

                          if (!booleanValue) {
                            form1.setValue("configurationId", undefined);
                            form1.setValue("expectedValue", undefined);
                            form1.setValue("elseChange", []);
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
                    control={form1.control}
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
                    control={form1.control}
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
                                <SelectItem value="NOTEQUAL">
                                  Diverso
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form1.control}
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
                    <p className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                      {nodes?.find((node) => node.id === item.nodeId)?.name}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsElseChangeState(false);
                        handleEditChange(index, false);
                      }}
                      className="flex items-center"
                    >
                      <FaEdit className="mr-2" />
                      Modifica
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setIsElseChangeState(false);
                        handleRemoveChange(index, false);
                      }}
                      className="flex items-center"
                    >
                      <FaTrash />
                      Rimuovi
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsElseChangeState(false);
                    handleAddChange();
                  }}
                  className="mt-2 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Aggiungi Cambiamento
                </Button>

                {form1.formState.errors.change && (
                  <p className="text-red-500 text-sm">
                    {form1.formState.errors.change.message}
                  </p>
                )}
              </div>

              {haveIf && (
                <div className="space-y-4">
                  <FormLabel>Cambiamenti else</FormLabel>
                  {elseChangeFields.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <p className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        {nodes?.find((node) => node.id === item.nodeId)?.name}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsElseChangeState(true);
                          handleEditChange(index, true);
                        }}
                        className="flex items-center"
                      >
                        <FaEdit className="mr-2" />
                        Modifica
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          setIsElseChangeState(true);
                          handleRemoveChange(index, true);
                        }}
                        className="flex items-center"
                      >
                        <FaTrash />
                        Rimuovi
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsElseChangeState(true);
                      handleAddChange();
                    }}
                    className="mt-2 flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Aggiungi Cambiamento
                  </Button>
                </div>
              )}

              <Button className="mt-4" type="submit">
                Aggiungi il Cambiamento
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal per aggiungere o modificare un cambiamento */}
      <Dialog
        open={isChangeDialogOpen}
        onOpenChange={(open) => {
          setIsChangeDialogOpen(open);
          if (!open) {
            form2.reset();
          }
        }}
      >
        <DialogContent className="w-full max-w-[600px] sm:w-3/4 md:w-2/4">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null
                ? "Modifica Cambiamento"
                : "Nuovo Cambiamento"}
            </DialogTitle>
            <DialogDescription>
              Seleziona un nodo e configura il cambiamento.
            </DialogDescription>
          </DialogHeader>
          <Form {...form2}>
            <form
              onSubmit={form2.handleSubmit(handleSaveChange)}
              className="space-y-3"
            >
              <FormField
                control={form2.control}
                name={"nodeId"}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Seleziona Nodo</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen} >
                      <PopoverTrigger asChild>
                        <FormControl className="w-full">
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? nodes && nodes.find((node) => node.id === field.value)
                                  ?.name
                              : "Seleziona un nodo"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Cerca un nodo..." />
                          <CommandList>
                            <CommandEmpty>Nessun nodo trovato.</CommandEmpty>
                            <CommandGroup>
                              {nodes && nodes.map((node) => (
                                <CommandItem
                                  key={node.id}
                                  value={node.name}
                                  onSelect={() => {
                                    field.onChange(node.id);
                                    setPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      node.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {node.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form2.control}
                name="visible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibile</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
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

              <FormField
                control={form2.control}
                name="changePosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cambia Posizione</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
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

              {form2.watch("changePosition") && (
                <div className="flex flex-wrap gap-2">
                  <FormField
                    control={form2.control}
                    name="position.x"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[100px]">
                        <FormLabel>Posizione X</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="X"
                            value={field.value !== undefined ? field.value : 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="position.y"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[100px]">
                        <FormLabel>Posizione Y</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Y"
                            value={field.value !== undefined ? field.value : 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="position.z"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[100px]">
                        <FormLabel>Posizione Z</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Z"
                            value={field.value !== undefined ? field.value : 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form2.control}
                name="changeScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cambia Scala</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
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

              {form2.watch("changeScale") && (
                <div className="flex flex-wrap gap-2">
                  <FormField
                    control={form2.control}
                    name="scale.x"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[100px]">
                        <FormLabel>Scala X</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="X"
                            value={field.value !== undefined ? field.value : 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="scale.y"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[100px]">
                        <FormLabel>Scala Y</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Y"
                            value={field.value !== undefined ? field.value : 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="scale.z"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[100px]">
                        <FormLabel>Scala Z</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Z"
                            value={field.value !== undefined ? field.value : 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button className="mt-4" type="submit">
                {editingIndex !== null
                  ? "Salva Modifiche"
                  : "Aggiungi Cambiamento"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewConfigurationChangeBtn;
