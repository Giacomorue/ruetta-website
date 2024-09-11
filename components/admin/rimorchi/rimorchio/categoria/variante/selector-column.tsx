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
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
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
import {
  DeleteConfiguration,
  DeleteSelector,
  DuplicateConfiguration,
  DuplicateSelector,
} from "@/actions/trailer";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { boolean } from "zod";

export type SelectorColumnType = {
  id: string;
  name: string;
  configurationToRefer: string;
  visible: boolean;
  nOption: number;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  socketId: string;
  onRevalidate: () => void;
};

export const SelectorColumnSchema: ColumnDef<SelectorColumnType>[] = [
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
      return <CellNome row={row} />;
    },
  },
  {
    id: "Configurazione",
    accessorKey: "configurationToRefer",
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
          <span style={{ padding: "0 0px" }}>Configurazione</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId);

      // Assicurati che filterValue sia un array e controlla se include rowValue
      if (Array.isArray(filterValue)) {
        return filterValue.includes(rowValue);
      }

      return false; // Se filterValue non è un array, non ci sono corrispondenze
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
    id: "Ordine",
    accessorKey: "order",
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
          <span style={{ padding: "0 0px" }}>Ordine</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.order + 1;
    },
  },
  {
    id: "Numero Opzioni",
    accessorKey: "nOption",
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
          <span style={{ padding: "0 0px" }}>Numero Opzioni</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "Ultima Modifica",
    accessorKey: "updatedAt",
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
    cell: ({ row }) => {
      return formatDistanceToNow(new Date(row.original.updatedAt), {
        addSuffix: true,
        locale: it,
      });
    },
  },
];

const CellNome = ({ row }: { row: Row<SelectorColumnType> }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const trailerId = segments[segments.length - 3];
  const categoryId = segments[segments.length - 2];
  const variantId = segments[segments.length - 1];

  return (
    <Link
      href={
        "/admin/rimorchi/" +
        trailerId +
        "/" +
        categoryId +
        "/" +
        variantId +
        "/selector/" +
        row.original.id
      }
      className="hover:underline"
    >
      {row.original.name}
    </Link>
  );
};

const CellAction = ({ row }: { row: Row<SelectorColumnType> }) => {
  const router = useRouter();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const adminLoader = useAdminLoader();

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const trailerId = segments[segments.length - 3];
  const categoryId = segments[segments.length - 2];
  const variantId = segments[segments.length - 1];

  const onDelete = async (id: string) => {
    adminLoader.startLoading();
    await DeleteSelector(id, row.original.socketId).then((res) => {
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
          description: "Selettore cancellato con successo",
        });
        row.original.onRevalidate();
      }
    });
    setAlertDialogOpen(false);
    adminLoader.stopLoading();
  };

  const onDuplicate = async (id: string) => {
    adminLoader.startLoading();
    await DuplicateSelector(id, row.original.socketId).then((res) => {
      if (!res) return;
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      }
      if (res.newSelector) {
        toast({
          variant: "default",
          title: "Successo",
          description: "Configurazione duplicata con successo",
        });
        row.original.onRevalidate();
      }
    });
    adminLoader.stopLoading();
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
            router.push(
              "/admin/rimorchi/" +
                trailerId +
                "/" +
                categoryId +
                "/" +
                variantId +
                "/selector/" +
                row.original.id
            );
          }}
          className="gap-2 items-center flex flex-row"
        >
          <Edit className="w-4 h-4" />
          Modifica
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDuplicate(row.original.id)}
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
              Sei sicuro di voler cancellare il selettore {row.original.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Questa non è un&apos;azione reversibile. Rimuovendo il selettore
              non sarà più accessibile in alcun modo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(row.original.id)}>
              Cancella
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};
