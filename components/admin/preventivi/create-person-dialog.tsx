"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreateNewPersonSchema,
  CreateNewPersonType,
} from "@/schemas/preventivi";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { toast } from "@/components/ui/use-toast";
import { CreatePerson } from "@/actions/preventivi";
import { Person } from "prisma/prisma-client";
import { FaPlus } from "react-icons/fa6";

export default function CreatePersonDialog({
  socketId,
  onRevalidate,
}: {
  socketId: string;
  onRevalidate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "codiceFiscale" | "partitaIva"
  >("codiceFiscale");
  const adminLoader = useAdminLoader();

  const form = useForm<CreateNewPersonType>({
    resolver: zodResolver(CreateNewPersonSchema),
    defaultValues: {
      ragioneSociale: "",
      citta: "",
      codiceFiscale: "",
      partitaIva: "",
      telefono: "",
      email: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = async (data: CreateNewPersonType) => {
    adminLoader.startLoading();
    await CreatePerson(data).then((res) => {
      if (!res) return;
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      } else {
        toast({
          variant: "default",
          title: "Persona creata con successo",
        });
        if (res.person) {
          onRevalidate(); // Call the revalidate function after successful creation
        }
        form.reset();
        setOpen(false); // Close the dialog
      }
    });
    adminLoader.stopLoading();
  };

  // Funzione per gestire il cambio tra Codice Fiscale e Partita IVA
  const handleTabChange = (tab: "codiceFiscale" | "partitaIva") => {
    setSelectedTab(tab);
    if (tab === "codiceFiscale") {
      form.setValue("partitaIva", ""); // Resetta Partita IVA quando si seleziona Codice Fiscale
    } else {
      form.setValue("codiceFiscale", ""); // Resetta Codice Fiscale quando si seleziona Partita IVA
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <FaPlus className="w-4 h-4" />
          Aggiungi una persona
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova Persona</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli per creare una nuova persona.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Ragione Sociale */}
            <FormField
              control={form.control}
              name="ragioneSociale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ragione Sociale</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Inserisci la ragione sociale"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Città */}
            <FormField
              control={form.control}
              name="citta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Città</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Inserisci la città" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tabs per Codice Fiscale o Partita IVA */}
            <Tabs defaultValue="codiceFiscale" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger
                  value="codiceFiscale"
                  onClick={() => handleTabChange("codiceFiscale")}
                  className={selectedTab === "codiceFiscale" ? "active" : ""}
                >
                  Codice Fiscale
                </TabsTrigger>
                <TabsTrigger
                  value="partitaIva"
                  onClick={() => handleTabChange("partitaIva")}
                  className={selectedTab === "partitaIva" ? "active" : ""}
                >
                  Partita IVA
                </TabsTrigger>
              </TabsList>

              {/* Tab per Codice Fiscale */}
              <TabsContent value="codiceFiscale">
                <FormField
                  control={form.control}
                  name="codiceFiscale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Inserisci il codice fiscale"
                        />
                      </FormControl>
                      {errors.codiceFiscale?.message && (
                        <FormMessage>
                          {errors.codiceFiscale.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Tab per Partita IVA */}
              <TabsContent value="partitaIva">
                <FormField
                  control={form.control}
                  name="partitaIva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partita IVA</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Inserisci la partita IVA"
                        />
                      </FormControl>
                      <FormMessage>{errors.partitaIva?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Telefono */}
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Inserisci il numero di telefono"
                    />
                  </FormControl>
                  {errors.telefono?.message && (
                    <FormMessage>{errors.telefono.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Inserisci l'email" />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="mt-3 w-full">
                Aggiungi Persona
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
