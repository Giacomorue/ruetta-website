"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as React from "react";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DataTablePagination } from "@/components/admin/data-table-pagination";
import { DataTableFacetedFilter } from "@/components/admin/data-table-faceted-filter";
import { Fornitori } from "@/constants";
import { DataTableViewOptions } from "@/components/admin/data-table-view-options";
import { Configuration, Selector } from "prisma/prisma-client";
import ReorderSelectorsBtn from "./reorder-selectors-btn";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  allConfiguration: Configuration[];
  selectors: Selector[];
  variantId: string;
  socketId: string;
  onRevalidate: () => void;
}

export function AllSelectorDataTable<TData, TValue>({
  columns,
  data,
  allConfiguration,
  selectors,
  variantId,
  onRevalidate,
  socketId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex md:flex-row flex-col md:items-center gap-2 md:gap-4 mb-4">
        <Input
          placeholder="Cerca nome..."
          value={(table.getColumn("Nome")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Nome")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DataTableFacetedFilter
          column={table.getColumn("Configurazione")}
          title="Configurazione"
          options={allConfiguration.map((f) => ({
            label: f.name,
            value: f.name,
          }))}
        />
        <DataTableFacetedFilter
          column={table.getColumn("Visibile")}
          title="Visibile"
          options={[
            { label: "Sì", value: "true" },
            { label: "No", value: "false" },
          ]}
        />
        <div className="ml-auto flex flex-row items-center gap-2">
          <ReorderSelectorsBtn
            selectors={selectors}
            disabled={selectors.length <= 1}
            variantId={variantId}
            onRevalidate={onRevalidate}
            socketId={socketId}
          />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nessun risultato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
      <DataTablePagination table={table} />
    </div>
  );
}
