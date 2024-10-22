"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { Prisma } from "prisma/prisma-client";

type PersonType = Prisma.PersonGetPayload<{
  include: {
    requestOfPrev: true;
  };
}>;

// Define the columns
export const PersonColumnSchema: ColumnDef<PersonType>[] = [
  {
    header: "Azioni",
    cell: ({ row }) => {
      return <CellAction row={row} />;
    },
  },
  {
    id: "Nome",
    accessorKey: "ragioneSociale",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          style={{
            padding: "0",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ padding: "0 0px" }}>Nome</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/admin/preventivi/persona/${row.original.id}`}
          className="hover:underline"
        >
          {row.original.ragioneSociale}
        </Link>
      );
    },
  },
  {
    id: "Città",
    accessorKey: "citta",
    header: "Città",
    cell: ({ row }) => row.original.citta,
  },
  {
    id: "Codice Fiscale",
    accessorKey: "codiceFiscale",
    header: "Codice Fiscale",
    cell: ({ row }) => row.original.codiceFiscale || "N/A",
  },
  {
    id: "Partita IVA",
    accessorKey: "partitaIva",
    header: "Partita IVA",
    cell: ({ row }) => row.original.partitaIva || "N/A",
  },
  {
    id: "Richieste di Preventivi Attivi",
    accessorFn: (row) => row.requestOfPrev.length, // Use accessorFn for sorting
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          style={{
            padding: "0",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ padding: "0 0px" }}>Richieste Attivi</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.requestOfPrev.length,
  },
  {
    id: "Ultima Modifica",
    accessorFn: (row) => row.updatedAt,
    cell: ({ row }) => {
      return (
        <div>
          {formatDistanceToNow(new Date(row.original.updatedAt), {
            addSuffix: true,
            locale: it,
          })}
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          style={{
            padding: "0",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ padding: "0 0px" }}>Ultima Modifica</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

// Cell actions for editing
const CellAction = ({ row }: { row: Row<PersonType> }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-1">
        <DropdownMenuLabel>Azioni</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/admin/preventivi/persona/${row.original.id}`);
          }}
          className="gap-2 items-center flex flex-row"
        >
          <Edit className="w-4 h-4" />
          Modifica
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
