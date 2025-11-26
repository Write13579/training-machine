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
  },
  {
    accessorKey: "ćwiczenia",
    header: "Ćwiczenia",
    cell: ({ row }) =>
      row.original.ćwiczenia.length !== 0 ? (
        <div className="flex items-center justify-center">
          <WyswietlCwiczeniaZPlanu row={row.original} />
        </div>
      ) : (
        <Button variant={"outline"}>rest day</Button> // zrob zeby sie to troche wyroznialo; ten button ma byc disabled, mozesz to zmienic na jakis ladny div
      ),
  },
  {
    accessorKey: "akcje",
    header: "Akcje",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DodajCwiczenieDoPlanu row={row.original} listaCwiczen={listaCwiczen} />
      </div>
    ),
  },
];
