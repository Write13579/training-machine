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
    deleted: boolean;
    plans: {
      id: number;
      userId: number;
      dzienTygodnia: number;
      exerciseId: number;
      addedAt: Date;
      updatedAt: Date;
      activePlan: boolean;
      fullPlanId: number;
    }[];
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
    listaPlanowUsera
  ) as ColumnDef<TData, TValue>[];

  const [idPlanu, setIdPlanu] = useState<number | null>(null);

  useEffect(() => {
    const znalezionyPlan = listaPlanowUsera.find(
      (plan) => plan.nazwa == namePlan
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
    <div>
      <Button
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="wybierz" />
          </SelectTrigger>
          <SelectContent>
            {listaPlanowUsera.map((plan) => (
              <SelectItem key={plan.id} value={plan.nazwa}>
                {plan.nazwa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          disabled={!activeInput}
          value={namePlan}
          onChange={(e) => {
            setNamePlan(e.target.value);
          }}
        />
      )}
      <Button
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
                  const headerWidths = {
                    'dzień': 'w-[45%]',
                    'ćwiczenia': 'w-[38%]',
                    'akcje': 'w-[17%]'
                  };
                  const headerWidth = headerWidths[header.column.id as keyof typeof headerWidths] || 'w-auto';
                  
                  return (
                    <TableHead key={header.id} className={headerWidth}>
                      <div className="text-center font-MySerif text-sm text-black">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
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
                  {row.getVisibleCells().map((cell) => {
                    const columnColors = {
                      'dzień': 'text-[8px] font-MySerif leading-tight text-center bg-[#FF4D6D] rounded-[20px] py-[3px] px-2 md:py-[5px] md:px-3 items-center shadow-md shadow-black/40 ring-black/5',
                      'ćwiczenia': 'text-[10px] font-MySerif leading-tight text-center bg-black rounded-[20px] py-[3px] px-2 md:py-[5px] md:px-3 items-center shadow-md shadow-black/40 ring-black/5 transition-all duration-500 ease-in-out cursor-pointer hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]',
                      'akcje': 'text-sm font-MySerif flex justify-center items-center py-[4px] px-2 md:py-[6px] md:px-2'
                    };
                    const cellWidths = {
                      'dzień': 'w-[45%]',
                    'ćwiczenia': 'w-[38%]',
                    'akcje': 'w-[17%]'
                    };
                    const bgColor = columnColors[cell.column.id as keyof typeof columnColors] || 'bg-[#FF4D6D]';
                    const cellWidth = cellWidths[cell.column.id as keyof typeof cellWidths] || '';
                    
                    return (
                      <TableCell key={cell.id} className={cellWidth}>
                        <div className={`${bgColor}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
      )}
      {!activeInput && (
        <div>
          chuj dupa cipa pozdro ~Kajetan
          <div>
            UWAGA: jeśli modyfikujesz już aktywowany plan to musisz go ponownie
            aktywować po zmianach
          </div>
          <AktywujPlanBtn fullPlanId={idPlanu} />
        </div>
      )}
    </div>
  );
}
