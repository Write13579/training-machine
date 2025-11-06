"use client";

import { Input } from "@/components/ui/input";
import { Exercise } from "@/lib/database/scheme";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ZapiszWynikBtn from "./ZapiszWynikBtn";

export type WynikType = {
  id: number;
  userId: number;
  dzienTygodnia: number;
  exerciseId: number;
  addedAt: Date;
  updatedAt: Date;
  activated: boolean;
  exercise: Exercise;
  wynik: { serie: number; powtorzenia: number; ciezar: number };
};

export const columns: ColumnDef<WynikType>[] = [
  {
    accessorKey: "exerciseId",
    header: "Ćwiczenie",
    cell: ({ row }) => <span>{row.original.exercise.nazwa}</span>,
  },
  {
    header: "alles",
    cell: ({ row }) => {
      const [serie, useSerie] = useState<number>(row.original.wynik.serie);
      const [powtorzenia, usePowtorzenia] = useState<number>(
        row.original.wynik.powtorzenia
      );
      const [ciezar, useCiezar] = useState<number>(row.original.wynik.ciezar);

      const selectedDay = row.original.dzienTygodnia;
      const dzisiaj = new Date();

      const todayDow = dzisiaj.getDay();
      const deltaDays = (todayDow - selectedDay + 7) % 7;
      const targetDate = new Date(
        dzisiaj.getFullYear(),
        dzisiaj.getMonth(),
        dzisiaj.getDate() - deltaDays
      );

      return (
        <div id="alles">
          <span>serie:</span>
          <Input
            className="w-20"
            value={serie}
            type="number"
            onChange={(e) => useSerie(Number(e.target.value))}
          />
          <span>powtórzenia:</span>
          <Input
            className="w-20"
            value={powtorzenia}
             type="number"
            onChange={(e) => usePowtorzenia(Number(e.target.value))}
          />
          <span>ciężar:</span>
          <Input
            className="w-20"
            value={ciezar}
             type="number"
            onChange={(e) => useCiezar(Number(e.target.value))}
          />
          <ZapiszWynikBtn
            id={row.original.id}
            serie={serie}
            powtorzenia={powtorzenia}
            ciezar={ciezar}
            targetDate={targetDate}
          />
        </div>
      );
    },
  },
];
