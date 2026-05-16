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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AktywujPlanBtn from "./AktywujPlanBtn";

interface DataTableProps<TData, TValue> {
  data: TData[];
  listaWszystkichCwiczen: {
    id: number;
    nazwa: string;
    opis: string;
    createdByUserId: number | null;
    deleted: boolean;
  }[];
  listaPlanowUsera: { id: number; userId: number; nazwa: string }[];
}

export function DataTable<TData, TValue>({
  data,
  listaWszystkichCwiczen,
  listaPlanowUsera,
}: DataTableProps<TData, TValue>) {
  const [namePlan, setNamePlan] = useState<string>("");
  const [activeInput, setActiveInput] = useState<boolean>(true);

  const [switchBeetwenSelectAndInput, setSwitchBeetwenSelectAndInput] =
    useState<boolean>(true);

  const cols = columns(
    listaWszystkichCwiczen,
    namePlan,
    listaPlanowUsera,
  ) as ColumnDef<TData, TValue>[];

  const [idPlanu, setIdPlanu] = useState<number | null>(null);

  useEffect(() => {
    const znalezionyPlan = listaPlanowUsera.find(
      (plan) => plan.nazwa == namePlan,
    );
    if (znalezionyPlan) {
      setIdPlanu(znalezionyPlan.id);
    } else {
      setIdPlanu(null);
    }
  }, [namePlan]);

  const table = useReactTable({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="text-center">
      <Button
        className="my-5 w-[240px] py-[17px] rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[100ms]"
        disabled={!activeInput}
        onClick={() => {
          setSwitchBeetwenSelectAndInput(!switchBeetwenSelectAndInput);
          setNamePlan("");
        }}>
        {switchBeetwenSelectAndInput
          ? "Stworz nowy plan"
          : "Edytuj istniejący plan"}
      </Button>
      {switchBeetwenSelectAndInput ? (
        <Select
          disabled={!activeInput}
          onValueChange={(value) => setNamePlan(value)}>
          <SelectTrigger className=" w-[180px] mx-auto flex items-center justify-center gap-2 border-0 bg-[#FF4D6D] rounded-[14px] px-4 shadow-md shadow-black/40 ring-0 hover:shadow-lg transition-shadow duration-200">
            <SelectValue placeholder="wybierz" />
          </SelectTrigger>
          <SelectContent className="w-[min(55vw,720px)] max-h-[60vh] overflow-y-auto bg-[#ffffff] rounded-[14px] p-4 shadow-2xl shadow-black/40 ring-0 ring-black/0 text-black">
            {listaPlanowUsera.map((plan) => (
              <SelectItem
                key={plan.id}
                value={plan.nazwa}
                className="py-2 px-3 rounded-md hover:bg-[#FFCCD5] text-black">
                {plan.nazwa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="w-[75%] mx-auto">
          <Input
            disabled={!activeInput}
            value={namePlan}
            onChange={(e) => {
              setNamePlan(e.target.value);
            }}
            placeholder="Wpisz nazwę planu"
            className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
          />
          <div className="h-[2px] bg-black w-full mt-0" aria-hidden="true" />
        </div>
      )}
      <Button
        className="my-5 w-[180px] py-[17px] rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[100ms]"
        disabled={!namePlan}
        onClick={() => {
          setActiveInput(!activeInput);
        }}>
        {activeInput ? "Dalej" : "Wstecz"}
      </Button>
      {!activeInput && (
        <Table className="w-full table-fixed rounded-md overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <div className="text-center font-MySerif text-sm text-black">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
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
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={cols.length} className="h-24 text-center">
                  Brak danych do wyświetlenia.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {!activeInput && (
        <div>
          <div className="font-MySerif mt-3 text-[12px] text-[#858383] font-bold mb-2">
            UWAGA: jeśli modyfikujesz już aktywowany plan to musisz go ponownie
            aktywować po zmianach
          </div>
          <AktywujPlanBtn fullPlanId={idPlanu} />
        </div>
      )}
    </div>
  );
}
