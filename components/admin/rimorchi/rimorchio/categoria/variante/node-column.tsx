"use client";

import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { DeleteNode, UpdateNode } from "@/actions/trailer";
import EditNodeBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/edit-node-btn"; // Assumendo che tu abbia questo componente separato

export type NodeColumnType = {
  id: string;
  name: string;
  alwaysHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  variantId: string;
  socketId: string;
  onRevalidate: () => void;
};

export const NodeColumnSchema: ColumnDef<NodeColumnType>[] = [
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
  },
  {
    id: "Sempre nascosto",
    accessorKey: "alwaysHidden",
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
          <span style={{ padding: "0 0px" }}>Sempre nascosto</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.alwaysHidden ? "Si" : "No"),
    filterFn: (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId) ? "true" : "false";
      return filterValue.includes(rowValue);
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
    cell: ({ row }) =>
      formatDistanceToNow(new Date(row.original.updatedAt), {
        addSuffix: true,
        locale: it,
      }),
  },
];

const CellAction = ({ row }: { row: Row<NodeColumnType> }) => {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const adminLoader = useAdminLoader();

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (alertDialogOpen) {
      setMessage("");
    }
  }, [alertDialogOpen]);

  const onDelete = async (id: string) => {
    adminLoader.startLoading();
    await DeleteNode(id, row.original.socketId).then((res) => {
      if (!res) return;
      if (res.youCant && res.message) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Non puoi cancellare il nodo",
        });
        setMessage(
          "<strong>Non puoi cancellare il nodo poichè è: </strong><br />" +
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
          description: "Nodo cancellato con successo",
        });
        setAlertDialogOpen(false);
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
          onClick={() => setEditDialogOpen(true)}
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
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            {message !== "" ? (
              <DialogTitle className="text-xl">
                Errore nella cancellazione del nodo {row.original.name}
              </DialogTitle>
            ) : (
              <DialogTitle className="text-xl">
                Sei sicuro di voler cancellare il nodo {row.original.name}?
              </DialogTitle>
            )}
            {message !== "" ? (
              <DialogDescription
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ) : (
              <DialogDescription>
                Questa non è un&apos;azione reversibile. Rimuovendo il nodo non
                sarà più accessibile in alcun modo.
              </DialogDescription>
            )}
          </DialogHeader>
          {message !== "" ? (
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => {
                  setAlertDialogOpen(false);
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
                Cancella
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      {editDialogOpen && (
        <EditNodeBtn
          socketId={row.original.socketId}
          onRevalidate={row.original.onRevalidate}
          node={row.original}
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
        />
      )}
    </DropdownMenu>
  );
};
