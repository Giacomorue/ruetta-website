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
import { useEffect, useState } from "react";
import { DeleteConfiguration, DuplicateConfiguration } from "@/actions/trailer";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DuplicateConfigurationToVariantDialog from "./duplicate-configuration-in-external-variant-dialog";

export type ConfigurationColumnType = {
  id: string;
  name: string;
  defaultValue: string | null;
  variantId: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  socketId: string;
  onRevalidate: () => void;
};

export const ConfigurationColumnSchema: ColumnDef<ConfigurationColumnType>[] = [
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
    id: "Valore di Default",
    accessorKey: "defaultValue",
    header: "Valore di Default",
    cell: ({ row }) => {
      return row.original.defaultValue || "N/A";
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

const CellNome = ({ row }: { row: Row<ConfigurationColumnType> }) => {
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
        "/configurazione/" +
        row.original.id
      }
      className="hover:underline"
    >
      {row.original.name}
    </Link>
  );
};

const CellAction = ({ row }: { row: Row<ConfigurationColumnType> }) => {
  const router = useRouter();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const adminLoader = useAdminLoader();

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const trailerId = segments[segments.length - 3];
  const categoryId = segments[segments.length - 2];
  const variantId = segments[segments.length - 1];

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (alertDialogOpen) {
      setMessage("");
    }
  }, [alertDialogOpen]);

  const onDelete = async (id: string) => {
    adminLoader.startLoading();
    await DeleteConfiguration(id, row.original.socketId).then((res) => {
      if (!res) return;
      if (res.youCant && res.message) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Non puoi cancellare la configurazione",
        });
        setMessage(
          "<strong>Non puoi cancellare la configurazione poichè è: </strong> " +
            res.message
        );
      }
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
        setAlertDialogOpen(false);
      }
      if (res.success) {
        toast({
          variant: "default",
          title: "Successo",
          description: "Configurazione cancellata con successo",
        });
        setAlertDialogOpen(false);
        row.original.onRevalidate();
      }
    });
    adminLoader.stopLoading();
  };

  const onDuplicate = async (id: string) => {
    adminLoader.startLoading();
    await DuplicateConfiguration(id, row.original.socketId).then((res) => {
      if (!res) return;
      if (res.error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      }
      if (res.newConfig) {
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
                "/configurazione/" +
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
          onClick={() => setDuplicateDialogOpen(true)}
          className="gap-2 items-center flex flex-row"
        >
          <Copy className="w-4 h-4" />
          Duplica in altra variante
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 items-center flex flex-row bg-destructive text-destructive-foreground p-2"
          onClick={() => setAlertDialogOpen(true)}
        >
          <Trash className="w-4 h-4" />
          Elimina
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Duplicate Configuration in Another Variant Dialog */}
      <DuplicateConfigurationToVariantDialog
        configurationId={row.original.id}
        currentVariantId={variantId}
        trailerId={trailerId}
        open={duplicateDialogOpen}
        onClose={() => setDuplicateDialogOpen(false)}
      />

      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            {message !== "" ? (
              <DialogTitle className="text-xl">
                Errore nella cancellazione della configurazione{" "}
                {row.original.name}
              </DialogTitle>
            ) : (
              <DialogTitle className="text-xl">
                Sei sicuro di voler cancellare la configurazione{" "}
                {row.original.name}?
              </DialogTitle>
            )}
            {message !== "" ? (
              <DialogDescription
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ) : (
              <DialogDescription>
                Questa non è un&apos;azione reversibile. Rimuovendo la
                configurazione verranno anche cancellati tutti i dati associati.
              </DialogDescription>
            )}
          </DialogHeader>
          {message !== "" ? (
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => {
                  setAlertDialogOpen(false);
                  // setMessage("");
                }}
              >
                Chiudi
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => {
                  setAlertDialogOpen(false);
                  setMessage("");
                }}
              >
                Annulla
              </Button>
              <Button onClick={() => onDelete(row.original.id)}>
                {"Cancella"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};
