"use client";

import { Button } from "@/components/ui/button";
import { numerTygodniaNaString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import DodajCwiczenieDoPlanu from "./DodajCwiczenieDoPlanu";
import WyswietlCwiczeniaZPlanu from "./WyswietlCwiczeniaZPlanu";

export type DzienTreningowy = {
  dzień: number;
  ćwiczenia: { nazwaCwiczenia: string; nazwaPlanu: string }[];
};

export const columns = (
  listaCwiczen: {
    id: number;
    nazwa: string;
    opis: string;
  }[],
  nazwaPlanu: string
): ColumnDef<DzienTreningowy>[] => [
  {
    accessorKey: "dzień",
    header: "Dzień",
    cell: ({ row }) => <div>{numerTygodniaNaString(row.original.dzień)}</div>,
  },
  {
    accessorKey: "ćwiczenia",
    header: "Ćwiczenia",
    cell: ({ row }) =>
      row.original.ćwiczenia.length !== 0 ? (
        <div>
          <WyswietlCwiczeniaZPlanu
            row={row.original}
            nazwaFullPlanu={nazwaPlanu}
          />
        </div>
      ) : (
        <Button className="inline-flex items-center justify-center w-full h-full min-w-0">
          rest day
        </Button>
      ),
  },
  {
    accessorKey: "akcje",
    header: "Akcje",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DodajCwiczenieDoPlanu
          row={row.original}
          listaCwiczen={listaCwiczen}
          nazwaFullPlanu={nazwaPlanu}
        />
      </div>
    ),
  },
];
