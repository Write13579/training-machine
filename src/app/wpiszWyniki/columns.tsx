"use client";

import { Input } from "@/components/ui/input";
import { Exercise, PlanWithExercise } from "@/lib/database/scheme";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ZapiszWynikBtn from "./ZapiszWynikBtn";
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

// Zamiast dwóch osobnych kolumn renderujemy jeden różowy blok na cały wiersz
export const columns: ColumnDef<PlanWithExercise>[] = [
  {
    id: "fullRow",
    header: () => null,
    cell: ({ row }) => {
      const [serie, setSerie] = useState<number>(0);
      const [powtorzenia, setPowtorzenia] = useState<number>(0);
      const [ciezar, setCiezar] = useState<number>(0);

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

      const current = giveWynikFromCurrentDate(row.original);

      return (
        <div>
          <div className="w-full min-w-0 bg-[#FF4D6D] rounded-[20px] p-4 md:p-6 flex flex-col gap-4 shadow-md shadow-black/40 ring-1 ring-black/5 mb-5">
            {/* Pierwszy wiersz: nazwa zadania */}
            <div className="flex w-full">
              <span className="inline-flex items-center justify-center text-center text-white font-MySerif bg-black rounded-[14px] px-4 py-3 w-full break-words">
                {row.original.exercise.nazwa}
              </span>
            </div>

            {/* Drugi wiersz: serie, powtórzenia, kg */}
            <div className="bg-[#FFB3C1] rounded-[14px] p-4 shadow-md shadow-black/40 ring-1 ring-black/5">
              {current.id === -1 ? (
                <div className="grid grid-cols-3 gap-3 w-full">
                  <div className="flex flex-col">
                    <label className="text-[12px] text-black mb-2 font-semibold">serie:</label>
                    <Input
                      className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                      value={serie}
                      type="number"
                      onChange={(e) => setSerie(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[12px] text-black mb-2 font-semibold">powtórzenia:</label>
                    <Input
                      className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                      value={powtorzenia}
                      type="number"
                      onChange={(e) => setPowtorzenia(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[12px] text-black mb-2 font-semibold">kg:</label>
                    <Input
                      className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                      value={ciezar}
                      type="number"
                      onChange={(e) => setCiezar(Number(e.target.value))}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-black">
                  <div className="font-medium text-sm mb-3">Wynik zapisany!</div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-medium mb-1">Serie</div>
                      <div className="font-semibold bg-white rounded p-2">{current.serie}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium mb-1">Powtórzenia</div>
                      <div className="font-semibold bg-white rounded p-2">{current.powtorzenia}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium mb-1">Ciężar</div>
                      <div className="font-semibold bg-white rounded p-2">{current.ciezar}kg</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trzeci wiersz: przycisk zapisu/usunięcia */}
            <div className="w-full flex justify-center">
              {current.id === -1 ? (
                <ZapiszWynikBtn
                  id={row.original.id}
                  serie={serie}
                  powtorzenia={powtorzenia}
                  ciezar={ciezar}
                  targetDate={targetDate}
                />
              ) : (
                <UsunZapisanyWynikBtn
                  id={current.id}
                />
              )}
            </div>
          </div>
         </div>
       );
     },
   },
 ];
