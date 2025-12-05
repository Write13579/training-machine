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
import { numerTygodniaNaString } from "@/lib/utils"; // <-- do wyświetlenia dnia
import WyswietlCwiczeniaZPlanu from "./WyswietlCwiczeniaZPlanu";
import DodajCwiczenieDoPlanu from "./DodajCwiczenieDoPlanu";
import { Button } from "@/components/ui/button";

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
    <Table className="w-full table-fixed rounded-md overflow-hidden">
      <TableHeader>
        <TableRow>
          <TableHead colSpan={cols.length} className=" px-8 py-2">
            <div className="flex flex-row flex-wrap items-center gap-4">
              <div className="flex-none w-[22%] min-w-[72px] text-center font-MySerif text-sm text-black">
                Dzień
              </div>
              <div className="flex-1 w-[56%] text-center font-MySerif text-sm text-black">
                Ćwiczenia
              </div>
              <div className="flex-none w-[22%] min-w-[72px] text-center font-MySerif text-sm text-black">
                Akcje
              </div>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="align-center"
            >
              <TableCell colSpan={cols.length} className="py-1">
                <div className="bg-[#FF4D6D] rounded-[20px] p-4 flex flex-row flex-wrap items-center gap-4 shadow-md shadow-black/40 ring-1 ring-black/5">
                   {/* lewa kolumna: Dzień */}
                  <div className="flex-none w-[22%] min-w-[72px] text-center">
                    <div className="text-black font-MySerif font-medium">
                       {numerTygodniaNaString((row.original as any).dzień)}
                     </div>
                   </div>
 
                   {/* środkowa kolumna: Ćwiczenia */}
                  <div className="flex-1 min-w-[100px] py-2 bg-black rounded-full text-center
                  transition-all 
                  duration-500 
                  ease-in-out
                  cursor-pointer 
                  hover:tracking-[1px]
                  active:tracking-[3px]
                active:bg-white
                active:text-black
                  active:translate-y-[-2px]
                  active:duration-[200ms]">
                    {(row.original as any).ćwiczenia?.length ? (
                      <WyswietlCwiczeniaZPlanu row={(row.original as any)} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-MySerif font-medium">
                        rest day
                      </div>
                    )}
                  </div>
 
                   {/* prawa kolumna: Akcje */}
                  <div className="flex-none w-[22%] min-w-[72px] flex justify-center items-center">
                     <DodajCwiczenieDoPlanu
                       row={(row.original as any)}
                       listaCwiczen={listaCwiczen}
                     />
                   </div>
                 </div>
               </TableCell>
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
