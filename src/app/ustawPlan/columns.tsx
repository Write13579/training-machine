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
  }[],
  nazwaPlanu: string,
  listaPlanowUsera: { id: number; userId: number; nazwa: string }[]
): ColumnDef<DzienTreningowy>[] => [
  {
    accessorKey: "dzień",
    header: "Dzień",
    cell: ({ row }) => <div className="w-full text-center py-2 uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px]">
      {numerTygodniaNaString(row.original.dzień)}
      </div>,
  },
  {
    accessorKey: "ćwiczenia",
    header: "Ćwiczenia",
    cell: ({ row }) =>  {
      const wyswietlaneCwiczenia = {
        ...row,
        ćwiczenia: row.original.ćwiczenia.filter(
          (cwiczenie) => cwiczenie.nazwaPlanu === nazwaPlanu
        ),
      };

      return (
        <div className="w-full text-center py-2 rounded-full cursor-pointer border-0 bg-black  text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms] whitespace-nowrap overflow-hidden text-ellipsis">
          {wyswietlaneCwiczenia.ćwiczenia.length !== 0 ? (
            <WyswietlCwiczeniaZPlanu
              row={row.original}
              nazwaFullPlanu={nazwaPlanu}
            />
          ) : (
            "rest day"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "akcje",
    header: "Akcje",
    cell: ({ row }) => {
      const filteredListaCwiczen = listaCwiczen.filter((cwiczenie) => {
        const cwiczeniaDlaWybranegoPlanu = row.original.ćwiczenia.filter(
          (c) => c.nazwaPlanu === nazwaPlanu //tu musi być po id ale powiedzmy ze dziala
        );

        const cwiczeniaNazwy = cwiczeniaDlaWybranegoPlanu.map(
          (c) => c.nazwaCwiczenia
        );

        const nieMaCwiczenia = !cwiczeniaNazwy.includes(cwiczenie.nazwa);

        return nieMaCwiczenia;
      });

      return (
        <div className="flex items-center justify-center">
          <DodajCwiczenieDoPlanu
            row={row.original}
            listaCwiczen={filteredListaCwiczen}
            nazwaFullPlanu={nazwaPlanu}
          />
        </div>
      );
    },
  },
];
