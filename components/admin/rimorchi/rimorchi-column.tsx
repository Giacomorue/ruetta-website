"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from "lucide-react";
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
import { DelteTrailer } from "@/actions/trailer";
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

export type RimorchiColumnType = {
  id: string;
  name: string;
  description: string | undefined | "";
  fornitore: string;
  images: [];
  updatedAt: Date;
  createdAt: Date;
  categories: Category[] | [];
  visibile: boolean;
};

export const RimorchiColumnSchema: ColumnDef<RimorchiColumnType>[] = [
  {
    header: "Azioni",
    cell: ({ row }) => {
      return <CellAction row={row} />;
    },
  },
  {
    id: "Nome",
    accessorKey: "name",
    // header: "Nome",
    cell: ({ row }) => {
      return (
        <Link
          href={"/admin/rimorchi/" + row.original.id}
          className="hover:underline"
        >
          {row.original.name}
        </Link>
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
          <span style={{ padding: "0 0px" }}>Nome</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "Fornitore",
    accessorKey: "fornitore",
    // header: "Fornitore",
    cell: ({ row }) => {
      const fornitore = Fornitori.find((f) => f.id === row.original.fornitore);
      return fornitore?.name || "Nessuno";
    },
    filterFn: (row, columnId, filterValue) => {
      const filterValueArray = filterValue || [];
      return (
        filterValueArray.length === 0 ||
        filterValueArray.includes(row.getValue(columnId))
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
          <span style={{ padding: "0 0px" }}>Fornitore</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "Visibile",
    accessorKey: "visibile",
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
      return row.original.visibile ? "Sì" : "No";
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
    id: "Ultima modifica",
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
          <span style={{ padding: "0 0px" }}>Ultima modifica</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

const CellAction = ({ row }: { row: Row<RimorchiColumnType> }) => {
  const router = useRouter();
  const adminLoader = useAdminLoader();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const onDelte = async (id: string) => {
    adminLoader.startLoading();
    await DelteTrailer(id).then((res) => {
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
          description: "Rimorchio cancellato con successo",
        });
      }
    });
    adminLoader.stopLoading();
    setAlertDialogOpen(false);
  };

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
            router.push("/admin/rimorchi/" + row.original.id);
          }}
          className="gap-2 items-center flex flex-row"
        >
          <Edit className="w-4 h-4" />
          Modifica
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
              Sei sicuro di voler cancellare il rimorchio {row.original.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Questa non è un&apos;azione reversibile. Rimuovendo il rimorchio
              non verranno cancellati i preventivi già fatti, ma tutti i dati
              per i preventivi da fare andranno persi e quindi sono da fare a
              mano!
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
  );
};
