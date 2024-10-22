"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type Person = {
  id: string;
  ragioneSociale: string;
};

export function PersonSelectCombobox({
  people,
  handleSelectPerson,
}: {
  people: Person[];
  handleSelectPerson: (personId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null
  );
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Funzione per filtrare le persone in base alla ricerca
  const filteredPeople = people.filter((person) =>
    person.ragioneSociale.toLowerCase().includes(query.toLowerCase())
  );

  // Calcola la larghezza del trigger e imposta il popover content della stessa larghezza
  const popoverWidth = triggerRef.current?.offsetWidth || "100%";

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            ref={triggerRef} // Assegna il ref al trigger per calcolare la larghezza
          >
            {selectedPerson
              ? selectedPerson.ragioneSociale
              : "Seleziona una persona..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-full flex flex-col bg-popover text-popover-foreground rounded-md overflow-hidden"
          style={{ width: popoverWidth }}
        >
          <div className="flex items-center border-b px-3">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca una persona..."
              className="flex h-12 w-full py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>

          {filteredPeople.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nessuna persona trovata.
            </div>
          ) : (
            <ul className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              {filteredPeople.map((person) => (
                <li
                  key={person.id}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    selectedPerson?.id === person.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => {
                    setSelectedPerson(person);
                    handleSelectPerson(person.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPerson?.id === person.id
                        ? "opacity-100 text-accent-foreground"
                        : "opacity-0"
                    )}
                  />
                  {person.ragioneSociale}
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
