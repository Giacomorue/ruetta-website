"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          Visualizzazione
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Nascondi colonne</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" &&
              column.getCanHide() &&
              column.id !== "Nome" &&
              column.columnDef.header !== "Azioni"
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            table.getAllColumns().forEach((column) => {
              if (
                column.id !== "Nome" &&
                column.columnDef.header !== "Azioni"
              ) {
                column.toggleVisibility(true);
              }
            })
          }
        >
          <EyeIcon className="mr-2 h-4 w-4" />
          Mostra tutto
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getAllColumns().forEach((column) => {
              if (
                column.id !== "Nome" &&
                column.columnDef.header !== "Azioni"
              ) {
                column.toggleVisibility(false);
              }
            })
          }
        >
          <EyeOffIcon className="mr-2 h-4 w-4" />
          Nascondi tutto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
