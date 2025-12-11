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
  listaWszystkichCwiczen: { id: number; nazwa: string; opis: string }[];
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

  const cols = columns(listaWszystkichCwiczen, namePlan) as ColumnDef<
    TData,
    TValue
  >[];

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
                  data-state={row.getIsSelected() && "selected"}>
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
