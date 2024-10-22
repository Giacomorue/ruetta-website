"use client";

import { ColumnDef } from "@tanstack/react-table";
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

type RequestOfPrevType = Prisma.RequestOfPrevGetPayload<{
  include: {
    person: true;
    variant: true;
  };
}>;

// Definizione delle colonne della tabella
export const RequestOfPrevColumnSchema: ColumnDef<RequestOfPrevType>[] = [
  {
    header: "Azioni",
    cell: ({ row }) => {
      return <CellAction row={row} />;
    },
  },
  {
    id: "Nome Variante",
    accessorKey: "variant.name",
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
          <span style={{ padding: "0 0px" }}>Nome Variante</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/admin/preventivi/analyze/${row.original.id}`}
          className="hover:underline"
        >
          {row.original.variant.name}
        </Link>
      );
    },
  },
  {
    id: "Ragione sociale",
    accessorFn: (row) => row.person ? row.person.ragioneSociale : row.ragioneSociale,
    header: ({ column }) => (
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
        <span style={{ padding: "0 0px" }}>Ragione sociale</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.person
        ? row.original.person.ragioneSociale || "N/A"
        : row.original.ragioneSociale || "N/A";
    },
  },
  {
    id: "Città",
    accessorFn: (row) => row.person ? row.person.citta : row.citta,
    header: ({ column }) => (
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
        <span style={{ padding: "0 0px" }}>Città</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.person
        ? row.original.person.citta || "N/A"
        : row.original.citta || "N/A";
    },
  },
  {
    id: "PIva",
    accessorFn: (row) => row.person ? row.person.partitaIva : row.partitaIva,
    header: ({ column }) => (
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
        <span style={{ padding: "0 0px" }}>PIva</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.person
        ? row.original.person.partitaIva || "N/A"
        : row.original.partitaIva || "N/A";
    },
  },
  {
    id: "Codice fiscale",
    accessorFn: (row) => row.person ? row.person.codiceFiscale : row.codiceFiscale,
    header: ({ column }) => (
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
        <span style={{ padding: "0 0px" }}>Codice fiscale</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.person
        ? row.original.person.codiceFiscale || "N/A"
        : row.original.codiceFiscale || "N/A";
    },
  },
  {
    id: "Email",
    accessorFn: (row) => row.person ? row.person.email : row.email,
    header: ({ column }) => (
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
        <span style={{ padding: "0 0px" }}>Email</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.person
        ? row.original.person.email || "N/A"
        : row.original.email || "N/A";
    },
  },
  {
    id: "Telefono",
    accessorFn: (row) => row.person ? row.person.telefono : row.telefono,
    header: ({ column }) => (
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
        <span style={{ padding: "0 0px" }}>Telefono</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.person
        ? row.original.person.telefono || "N/A"
        : row.original.telefono || "N/A";
    },
  },
  {
    id: "Ultima Modifica",
    accessorFn: (row) => row.updatedAt,
    header: ({ column }) => (
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
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          {formatDistanceToNow(new Date(row.original.updatedAt), {
            addSuffix: true,
            locale: it,
          })}
        </div>
      );
    },
  },
];

// Azioni nella cella
const CellAction = ({ row }: { row: any }) => {
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
            router.push(`/admin/preventivi/analyze/${row.original.id}`);
          }}
          className="gap-2 items-center flex flex-row"
        >
          <Edit className="w-4 h-4" />
          Analizza
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
