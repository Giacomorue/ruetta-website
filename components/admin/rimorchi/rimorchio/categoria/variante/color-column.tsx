// "use client";

// import React, { useEffect, useState } from "react";
// import { ColumnDef, Row } from "@tanstack/react-table";
// import { ArrowUpDown, MoreHorizontal, Trash, Edit } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { formatDistanceToNow } from "date-fns";
// import { it } from "date-fns/locale";
// import { toast } from "@/components/ui/use-toast";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogTrigger,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useAdminLoader } from "@/hooks/useAdminLoader";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { boolean } from "zod";

// export type ColorColumnType = {
//   id: string;
//   name: string;
//   description?: string;
//   price?: number;
//   fileUrl?: string;
//   visible: boolean;
//   has3DModel: boolean;
//   colorCodePrincipal: string;
//   hasSecondaryColor: boolean;
//   colorCodeSecondary?: string;
//   images: string[];
//   order: number;
//   createdAt: Date;
//   updatedAt: Date;
//   variantId: string;
//   socketId: string;
//   onRevalidate: () => void;
// };

// export const ColorColumnSchema: ColumnDef<ColorColumnType>[] = [
//   {
//     header: "Azioni",
//     cell: ({ row }) => {
//       return <CellAction row={row} />;
//     },
//   },
//   {
//     id: "Nome",
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           style={{
//             padding: "0",
//             backgroundColor: "transparent",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <span style={{ padding: "0 0px" }}>Nome</span>
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       return <CellNome row={row} />;
//     },
//   },
//   {
//     id: "Ordine",
//     accessorKey: "order",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           style={{
//             padding: "0",
//             backgroundColor: "transparent",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <span style={{ padding: "0 0px" }}>Ordine</span>
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       return row.original.order + 1;
//     },
//   },
//   {
//     id: "Prezzo",
//     accessorKey: "price",
//     header: "Prezzo",
//     cell: ({ row }) => (row.original.price ? `${row.original.price} €` : "N/A"),
//   },
//   {
//     id: "Visibile",
//     accessorKey: "visible",
//     header: "Visibile",
//     cell: ({ row }) => (row.original.visible ? "Sì" : "No"),
//     filterFn: (row, columnId, filterValue) => {
//       const filterValueArray = filterValue || [];
//       const rowValue = row.getValue(columnId) ? "true" : "false";
//       return (
//         filterValueArray.length === 0 || filterValueArray.includes(rowValue)
//       );
//     },
//   },
//   {
//     id: "Modello 3D",
//     accessorKey: "has3DModel",
//     header: "Modello 3D",
//     cell: ({ row }) => (row.original.has3DModel ? "Sì" : "No"),
//     filterFn: (row, columnId, filterValue) => {
//       const filterValueArray = filterValue || [];
//       const rowValue = row.getValue(columnId) ? "true" : "false";
//       return (
//         filterValueArray.length === 0 || filterValueArray.includes(rowValue)
//       );
//     },
//   },
//   {
//     id: "Colore Principale",
//     accessorKey: "colorCodePrincipal",
//     header: "Colore Principale",
//     cell: ({ row }) => (
//       <div
//         className="relative w-6 h-6 rounded-full border border-border"
//         style={{
//           backgroundColor: row.original.colorCodePrincipal,
//           boxShadow:
//             "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
//         }}
//       >
//         {/* Effetto di luce nella parte superiore */}
//         <div
//           className="absolute inset-0 rounded-full"
//           style={{
//             background:
//               "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
//             maskImage: "radial-gradient(circle, black 60%, transparent 70%)",
//           }}
//         />
//       </div>
//     ),
//   },
//   {
//     id: "Colore Secondario",
//     accessorKey: "colorCodeSecondary",
//     header: "Colore Secondario",
//     cell: ({ row }) => (
//       <>
//         {row.original.hasSecondaryColor ? (
//           <div
//             className="relative w-6 h-6 rounded-full border border-border"
//             style={{
//               backgroundColor: row.original.colorCodeSecondary,
//               boxShadow:
//                 "0 4px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.3)",
//             }}
//           >
//             {/* Effetto di luce nella parte superiore */}
//             <div
//               className="absolute inset-0 rounded-full"
//               style={{
//                 background:
//                   "radial-gradient(circle at top, rgba(255, 255, 255, 0.6), transparent)",
//                 maskImage:
//                   "radial-gradient(circle, black 60%, transparent 70%)",
//               }}
//             />
//           </div>
//         ) : (
//           <span>No</span>
//         )}
//       </>
//     ),
//   },
//   {
//     id: "Ultima Modifica",
//     accessorKey: "updatedAt",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           style={{
//             padding: "0",
//             backgroundColor: "transparent",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <span style={{ padding: "0 0px" }}>Ultima Modifica</span>
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) =>
//       formatDistanceToNow(new Date(row.original.updatedAt), {
//         addSuffix: true,
//         locale: it,
//       }),
//   },
// ];

// const CellNome = ({ row }: { row: Row<ColorColumnType> }) => {
//   const pathname = usePathname();
//   const segments = pathname.split("/").filter(Boolean);

//   const trailerId = segments[segments.length - 3];
//   const categoryId = segments[segments.length - 2];
//   const variantId = segments[segments.length - 1];

//   return (
//     <Link
//       href={
//         "/admin/rimorchi/" +
//         trailerId +
//         "/" +
//         categoryId +
//         "/" +
//         variantId +
//         "/color/" +
//         row.original.id
//       }
//       className="hover:underline"
//     >
//       {row.original.name}
//     </Link>
//   );
// };

// const CellAction = ({ row }: { row: Row<ColorColumnType> }) => {
//   const [alertDialogOpen, setAlertDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const adminLoader = useAdminLoader();

//   const onDelete = async (id: string) => {
//     adminLoader.startLoading();
//     await DeleteColor(id, row.original.socketId).then((res) => {
//       if (!res) return;
//       if (res.error) {
//         toast({
//           variant: "destructive",
//           title: "Errore",
//           description: res.error,
//         });
//         setAlertDialogOpen(false);
//       }
//       if (res.success) {
//         toast({
//           variant: "default",
//           title: "Successo",
//           description: "Colore cancellato con successo",
//         });
//         setAlertDialogOpen(false);
//         row.original.onRevalidate();
//       }
//     });
//     adminLoader.stopLoading();
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="space-y-1">
//         <DropdownMenuLabel>Azioni</DropdownMenuLabel>
//         <DropdownMenuItem
//           onClick={() => setEditDialogOpen(true)}
//           className="gap-2 items-center flex flex-row"
//         >
//           <Edit className="w-4 h-4" />
//           Modifica
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           className="gap-2 items-center flex flex-row bg-destructive text-destructive-foreground p-2"
//           onClick={() => setAlertDialogOpen(true)}
//         >
//           <Trash className="w-4 h-4" />
//           Elimina
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//       <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-xl">
//               Sei sicuro di voler cancellare il colore {row.original.name}?
//             </DialogTitle>
//             <DialogDescription>
//               Questa non è un&apos;azione reversibile. Rimuovendo il colore non
//               sarà più accessibile in alcun modo.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant={"outline"}
//               onClick={() => {
//                 setAlertDialogOpen(false);
//               }}
//             >
//               Annulla
//             </Button>
//             <Button onClick={() => onDelete(row.original.id)}>Cancella</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </DropdownMenu>
//   );
// };
