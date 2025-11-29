"use client";

import { Input } from "@/components/ui/input";
import { Exercise, PlanWithExercise } from "@/lib/database/scheme";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ZapiszWynikBtn from "./ZapiszWynikBtn";
import { useRouter } from "next/navigation";
import UsunZapisanyWynikBtn from "./UsunZapisanyWynikBtn";

export type WynikType = {
  id: number;
  userId: number;
  dzienTygodnia: number;
  exerciseId: number;
  addedAt: Date;
  updatedAt: Date;
  activated: boolean;
  exercise: Exercise;
  wyniki: { serie: number; powtorzenia: number; ciezar: number }[];
};

export const columns: ColumnDef<PlanWithExercise>[] = [
  {
    accessorKey: "exerciseId",
    header: "Ćwiczenie",
    cell: ({ row }) => <span>{row.original.exercise.nazwa}</span>,
  },
  {
    header: "alles",
    cell: ({ row }) => {
      const [serie, useSerie] = useState<number>(
        0 /*row.original.wynik.serie */
      );
      const [powtorzenia, usePowtorzenia] = useState<number>(
        0 /* row.original.wynik.powtorzenia */
      );
      const [ciezar, useCiezar] = useState<number>(
        0 /* row.original.wynik.ciezar */
      );

      const selectedDay = row.original.dzienTygodnia;
      const dzisiaj = new Date();

      const todayDow = dzisiaj.getDay();
      const deltaDays = (todayDow - selectedDay + 7) % 7;
      const targetDate = new Date(
        dzisiaj.getFullYear(),
        dzisiaj.getMonth(),
        dzisiaj.getDate() - deltaDays
      );

      function giveWynikFromCurrentDate(plan: PlanWithExercise) {
        return (
          plan.wyniki.find((wynik) => {
            const wynikDate = wynik.dataWykonania;
            return (
              wynikDate.getFullYear() === targetDate.getFullYear() &&
              wynikDate.getMonth() === targetDate.getMonth() &&
              wynikDate.getDate() === targetDate.getDate()
            );
          }) || {
            id: -1,
            planId: -1,
            serie: 0,
            powtorzenia: 0,
            ciezar: 0,
            dataWykonania: new Date("1970-01-01"),
          }
        );
      }

      return (
        <div id="alles">
          {
            /*!giveWynikFromCurrentDate(row.original).ciezar &&
          !giveWynikFromCurrentDate(row.original).powtorzenia &&
          !giveWynikFromCurrentDate(row.original).serie*/ giveWynikFromCurrentDate(
              row.original
            ).id === -1 ? (
              <div>
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
            ) : (
              <div>
                <div>Wynik wpisany!</div>
                <div>
                  Serie: {giveWynikFromCurrentDate(row.original).serie},
                  Powtórzenia:{" "}
                  {giveWynikFromCurrentDate(row.original).powtorzenia}, Ciężar:{" "}
                  {giveWynikFromCurrentDate(row.original).ciezar}kg
                </div>
                <div>
                  <UsunZapisanyWynikBtn
                    id={giveWynikFromCurrentDate(row.original).id}
                  />
                </div>
              </div>
            )
          }
        </div>
      );
    },
  },
];
