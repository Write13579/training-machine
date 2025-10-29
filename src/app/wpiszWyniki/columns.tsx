"use client";

import { Exercise } from "@/lib/database/scheme";
import { ColumnDef } from "@tanstack/react-table";

export type WynikType = {
  id: number;
  userId: number;
  dzienTygodnia: number;
  exerciseId: number;
  addedAt: Date;
  updatedAt: Date;
  activated: boolean;
  exercise: Exercise;
};

export const columns: ColumnDef<WynikType>[] = [
  {
    accessorKey: "exerciseId",
    header: "Ćwiczenie",
    cell: ({ row }) => <span>{row.original.exercise.nazwa}</span>,
  },
  {
    header: "Liczba serii",
  },
  {
    header: "Liczba powtórzeń",
  },
  {
    header: "Ciężar (kg)",
  },
  {
    header: "pryć",
  },
];
