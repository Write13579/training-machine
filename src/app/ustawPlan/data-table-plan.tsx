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
                className="align-center"
                >
                {row.getVisibleCells().map((cell) => {
                  const cellClass = (cell.column.columnDef as any).meta?.cellClass as string | undefined;

                  return (
                    <TableCell key={cell.id}
                    className="py-1 align-center">
                        <div className={cellClass}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </TableCell>
                  );
                })}
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
