"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Definizione del tipo 'Person' basato sul modello Prisma
import { Person } from "prisma/prisma-client";
import NewPersonForm from "./new-person-form";
import { PersonSelectCombobox } from "./person-select-combobox";

type Props = {
  people: Person[];
  setPersonChose: (person: Person | null) => void;
  fetchPersone: () => void;
};

export function CreateSelectPerson({
  people,
  setPersonChose,
  fetchPersone,
}: Props) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectPerson = (personId: string) => {
    const person = people.find((p) => p.id === personId) || null;
    setSelectedPerson(person);
    console.log("Selezionato:", person);
  };

  return (
    <Tabs defaultValue="new" className="w-full space-y-4 mb-6">
      <TabsList className="grid w-full grid-cols-2 rounded-[10px]">
        <TabsTrigger className="rounded-[10px]" value="new">
          Crea Nuovo
        </TabsTrigger>
        <TabsTrigger className="rounded-[10px]" value="existing">
          Seleziona esistente
        </TabsTrigger>
      </TabsList>

      {/* Tab per selezionare una persona esistente */}
      <TabsContent value="existing" className="rounded-[10px]">
        <Card>
          <CardHeader>
            <CardTitle>Seleziona una persona</CardTitle>
            <CardDescription>
              Seleziona una persona già esistente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="person-select">Person</Label>
            <PersonSelectCombobox
              people={people}
              handleSelectPerson={(personId: string) =>
                handleSelectPerson(personId)
              }
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={selectedPerson === null}
              onClick={() => setPersonChose(selectedPerson)}
            >
              Conferma persona
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Tab per creare una nuova persona */}
      <TabsContent value="new">
        <Card>
          <CardHeader>
            <CardTitle>Crea una nuova persona</CardTitle>
            <CardDescription>
              Compila tutti i dati necessari per creare una nuova persona
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <NewPersonForm
              setPersonChose={setPersonChose}
              fetchPersone={fetchPersone}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
