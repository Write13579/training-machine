"use client";

import { Button } from "@/components/ui/button";
import { numerTygodniaNaString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { dodajCwiczenieDoDnia } from "./actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DzienTreningowy = {
  dzień: number;
  ćwiczenia: string[];
};

export const columns: ColumnDef<DzienTreningowy>[] = [
  {
    accessorKey: "dzień",
    header: "Dzień",
    cell: ({ row }) => numerTygodniaNaString(row.original.dzień),
  },
  {
    accessorKey: "ćwiczenia",
    header: "Ćwiczenia",
    cell: ({ row }) => row.original.ćwiczenia.filter(Boolean).join(", "),
  },
  {
    accessorKey: "akcje",
    header: "Akcje",
    cell: ({ row }) => {
      return (
        <div>
          <Button onClick={() => dodajCwiczenieDoDnia(row.original.dzień)}>
            <Plus />
          </Button>
        </div>
      );
    },
  },
];
