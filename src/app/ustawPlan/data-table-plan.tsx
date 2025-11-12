"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";

interface DataTableProps<TData, TValue> {
  data: TData[];
  listaCwiczen: { id: number; nazwa: string; opis: string }[];
}

export function DataTable<TData, TValue>({
  data,
  listaCwiczen,
}: DataTableProps<TData, TValue>) {
  const cols = columns(listaCwiczen) as ColumnDef<TData, TValue>[];

  const table = useReactTable({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
      <Table className="w-full table-fixed rounded-md border overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}
                  className="text-center font-MySerif text-sm text-black/90 pb-2">
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
                className="align-top"
                >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}
                  className="py-2 align-top"
                  >
                    <div className="flex flex-col">
                    <div className="min-h-[1.6rem]"/>
                    <div className="text-pink-600 font-MySerif text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={cols.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  );
}
