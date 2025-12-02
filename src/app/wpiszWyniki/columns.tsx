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
          <div className="w-full min-w-0 bg-[#FF4D6D] rounded-[14px] p-6 flex flex-col shadow-md shadow-black/40 ring-1 ring-black/5">
            <div className="flex flex-row items-center gap-4 w-full min-w-0">
              <div className="flex-none basis-[60%] min-w-0">
                <div className="grid grid-rows-2 gap-2 items-center py-8 m-4 bg-[#FFB3C1] rounded-[14px] shadow-md shadow-black/40 ring-1 ring-black/5">
                  <div className="flex items-center justify-center w-full">
                    <span className="inline-flex items-center justify-center text-center text-white font-MySerif bg-black rounded-[14px] px-4 py-3 max-w-full break-words">
                      {row.original.exercise.nazwa}
                    </span>
                  </div>
                  <div className="flex items-center justify-center ">
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

              {/* prawa część: inputy / wynik (pozwól jej rosnąć) */}
              <div className="flex-1 min-w-0">
                {current.id === -1 ? (
                  <div className="grid grid-cols-1 gap-3 w-full">
                    <div className="flex flex-col">
                      <label className="text-[13px] text-black mb-1">serie:</label>
                      <Input
                        className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                        value={serie}
                        type="number"
                        onChange={(e) => setSerie(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[13px] text-black mb-1">powtórzenia:</label>
                      <Input
                        className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                        value={powtorzenia}
                        type="number"
                        onChange={(e) => setPowtorzenia(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[13px] text-black mb-1">kg:</label>
                      <Input
                        className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                        value={ciezar}
                        type="number"
                        onChange={(e) => setCiezar(Number(e.target.value))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center text-[13px]">
                    <div className="text-black">
                      <div className="font-medium text-sm mb-2">Wynik zapisany!</div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium">Serie</span>{" "}
                          <span className="font-semibold">{current.serie}</span>
                        </div>
                        <div>
                          <span className="font-medium">Powtórzenia</span>{" "}
                          <span className="font-semibold">{current.powtorzenia}</span>
                        </div>
                        <div>
                          <span className="font-medium">Ciężar</span>{" "}
                          <span className="font-semibold">{current.ciezar}kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
         </div>
       );
     },
   },
 ];
