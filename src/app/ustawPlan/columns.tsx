"use client";

import { Button } from "@/components/ui/button";
import { numerTygodniaNaString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import DodajCwiczenieDoPlanu from "./DodajCwiczenieDoPlanu";
import WyswietlCwiczeniaZPlanu from "./WyswietlCwiczeniaZPlanu";

export type DzienTreningowy = {
  dzień: number;
  ćwiczenia: string[];
};

export const columns = (
  listaCwiczen: { id: number; nazwa: string; opis: string }[]
): ColumnDef<DzienTreningowy>[] => [
  {
    accessorKey: "dzień",
    header: "Dzień",
    cell: ({ row }) => numerTygodniaNaString(row.original.dzień),
    meta: { cellClass: "w-full text-center py-[17px] rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]" },
  },
  {
    accessorKey: "ćwiczenia",
    header: "Ćwiczenia",
    cell: ({ row }) =>
      row.original.ćwiczenia.length !== 0 ? (
        <WyswietlCwiczeniaZPlanu row={row.original} />
      ) : (
        <Button className="inline-flex items-center justify-center w-full h-full min-w-0">rest day</Button>
      ),
    meta: { cellClass: "w-full text-center py-[17px] rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]" },
  },
  {
    accessorKey: "akcje",
    header: "Akcje",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DodajCwiczenieDoPlanu row={row.original} listaCwiczen={listaCwiczen} />
      </div>
    ),
    meta: { cellClass: "flex items-center justify-center min-w-0" },
  },
];
