"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaArrowsUpDown } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { Category } from "prisma/prisma-client";
import { Fornitori } from "@/constants";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { DeleteCategory, DeleteVariant, DelteTrailer } from "@/actions/trailer";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import DuplicateVariantDialog from "./duplicate-variant-dialog";

export type VariantColumnType = {
  trailerId: string;
  categoryId: string;
  id: string;
  name: string;
  prezzo: number;
  visible: boolean;
  configurable: boolean;
  has3DModel: boolean;
  updatedAt: Date;
  createdAt: Date;
  socketId: string;
  onRevalidate: () => void;
};

export const VariantColumnSchema: ColumnDef<VariantColumnType>[] = [
  {
    header: "Azioni",
    cell: ({ row }) => {
      return <CellAction row={row} />;
    },
  },
  {
    id: "Nome",
    accessorKey: "name",
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
          href={
            "/admin/rimorchi/" +
            row.original.trailerId +
            "/" +
            row.original.categoryId +
            "/" +
            row.original.id
          }
          className="hover:underline"
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    id: "Prezzo",
    accessorKey: "prezzo",
    cell: ({ row }) => {
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(row.original.prezzo);
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
          <span style={{ padding: "0 0px" }}>Prezzo</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "Visibile",
    accessorKey: "visible",
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
          <span style={{ padding: "0 0px" }}>Visibile</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.visible ? "Sì" : "No";
    },
    filterFn: (row, columnId, filterValue) => {
      const filterValueArray = filterValue || [];
      const rowValue = row.getValue(columnId) ? "true" : "false";
      return (
        filterValueArray.length === 0 || filterValueArray.includes(rowValue)
      );
    },
  },
  {
    id: "Configurabile",
    accessorKey: "configurable",
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
          <span style={{ padding: "0 0px" }}>Configurabile</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.configurable ? "Si" : "No";
    },
    filterFn: (row, columnId, filterValue) => {
      const filterValueArray = filterValue || [];
      const rowValue = row.getValue(columnId) ? "true" : "false";
      return (
        filterValueArray.length === 0 || filterValueArray.includes(rowValue)
      );
    },
  },
  {
    id: "Modelli 3D",
    accessorKey: "has3DModel",
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
          <span style={{ padding: "0 0px" }}>Modelli 3D</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.has3DModel ? "Si" : "No";
    },
    filterFn: (row, columnId, filterValue) => {
      const filterValueArray = filterValue || [];
      const rowValue = row.getValue(columnId) ? "true" : "false";
      return (
        filterValueArray.length === 0 || filterValueArray.includes(rowValue)
      );
    },
  },
  {
    id: "Ultima Modifica",
    accessorFn: (row) => row.updatedAt,
    cell: ({ row }) => {
      return (
        <div className="px-4">
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

const CellAction = ({ row }: { row: Row<VariantColumnType> }) => {
  const router = useRouter();
  const adminLoader = useAdminLoader();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);

  const onDelte = async (id: string) => {
    adminLoader.startLoading();
    await DeleteVariant(id, row.original.socketId).then((res) => {
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
          variant: "default",
          title: "Successo",
          description: "Variante cancellata con successo",
        });
        row.original.onRevalidate();
      }
    });
    adminLoader.stopLoading();
    setAlertDialogOpen(false);
  };

  return (
    <>
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
              router.push(
                "/admin/rimorchi/" +
                  row.original.trailerId +
                  "/" +
                  row.original.categoryId +
                  "/" +
                  row.original.id
              );
            }}
            className="gap-2 items-center flex flex-row"
          >
            <Edit className="w-4 h-4" />
            Modifica
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDuplicateDialogOpen(true)} // Open the duplicate dialog
            className="gap-2 items-center flex flex-row"
          >
            <Copy className="w-4 h-4" />
            Duplica
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 items-center flex flex-row bg-destructive text-destructive-foreground p-2"
            onClick={() => setAlertDialogOpen(true)}
          >
            <Trash className="w-4 h-4" />
            Elimina
          </DropdownMenuItem>
        </DropdownMenuContent>

        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sei sicuro di voler cancellare la variante {row.original.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Questa non è un&apos;azione reversibile. Rimuovendo la variante
              verranno anche cancellati tutti i preventivi da fare per questo
              rimorchio, ma non quelli già fatti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelte(row.original.id)}>
              Cancella
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </DropdownMenu>

      {/* Dialog for duplicating the variant */}
      {duplicateDialogOpen && (
        <DuplicateVariantDialog
          variantId={row.original.id}
          currentCategoryId={row.original.categoryId}
          trailerId={row.original.trailerId}
          open={duplicateDialogOpen}
          onClose={() => setDuplicateDialogOpen(false)}
        />
      )}
    </>
  );

};