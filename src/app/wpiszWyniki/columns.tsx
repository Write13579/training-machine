"use client";

import { Input } from "@/components/ui/input";
import { Exercise } from "@/lib/database/scheme";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ZapiszWynikBtn from "./ZapiszWynikBtn";
import UsunZapisanyWynikBtn from "./UsunZapisanyWynikBtn";

export type WynikType = {
  id: number;
  dzienTygodnia: number;
  exerciseId: number;
  exercise: Exercise;
  wyniki: {
    id: number;
    planId: number;
    userId: number;
    exerciseId: number;
    serie: number;
    powtorzenia: number;
    ciezar: number;
    dataWykonania: Date;
    udostepniony: boolean;
  }[];
};

// Zamiast dwóch osobnych kolumn renderujemy jeden różowy blok na cały wiersz
export const columns: ColumnDef<WynikType>[] = [
  {
    id: "fullRow",
    header: () => null,
    cell: ({ row }) => {
      const [serieDane, setSerieDane] = useState<
        Array<{ powtorzenia: number; ciezar: number }>
      >([{ powtorzenia: 0, ciezar: 0 }]);

      const selectedDay = row.original.dzienTygodnia;
      const dzisiaj = new Date();
      const todayDow = dzisiaj.getDay();
      const deltaDays = (todayDow - selectedDay + 7) % 7;
      const targetDate = new Date(
        dzisiaj.getFullYear(),
        dzisiaj.getMonth(),
        dzisiaj.getDate() - deltaDays,
      );

      function giveWynikiFromCurrentDate(plan: WynikType) {
        return plan.wyniki
          .filter((wynik) => {
            const wynikDate = wynik.dataWykonania;
            return (
              wynikDate.getFullYear() === targetDate.getFullYear() &&
              wynikDate.getMonth() === targetDate.getMonth() &&
              wynikDate.getDate() === targetDate.getDate()
            );
          })
          .sort((a, b) => a.serie - b.serie);
      }

      const current = giveWynikiFromCurrentDate(row.original);
      const hasCurrent = current.length > 0;

      function updateSeria(
        idx: number,
        field: "powtorzenia" | "ciezar",
        value: number,
      ) {
        setSerieDane((prev) =>
          prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
        );
      }

      function dodajSerie() {
        setSerieDane((prev) => [...prev, { powtorzenia: 0, ciezar: 0 }]);
      }

      function usunSerie(idx: number) {
        setSerieDane((prev) =>
          prev.length === 1 ? prev : prev.filter((_, i) => i !== idx),
        );
      }

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
              {!hasCurrent ? (
                <div className="w-full space-y-3">
                  {serieDane.map((seria, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-end">
                      <div className="text-sm font-semibold text-black">
                        S{idx + 1}
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[12px] text-black mb-2 font-semibold">
                          powtórzenia:
                        </label>
                        <Input
                          className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                          value={seria.powtorzenia}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            updateSeria(
                              idx,
                              "powtorzenia",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[12px] text-black mb-2 font-semibold">
                          kg:
                        </label>
                        <Input
                          className="w-full bg-white border-0 p-2 text-sm shadow-md shadow-black/40 ring-1 ring-black/5"
                          value={seria.ciezar}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            updateSeria(idx, "ciezar", Number(e.target.value))
                          }
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => usunSerie(idx)}
                        className="h-9 px-3 rounded bg-black text-white text-xs">
                        Usuń
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={dodajSerie}
                    className="h-9 px-4 rounded bg-black text-white text-xs">
                    Dodaj serię
                  </button>
                </div>
              ) : (
                <div className="text-black">
                  <div className="font-medium text-sm mb-3">
                    Wyniki zapisane!
                  </div>
                  <div className="space-y-2 text-sm">
                    {current.map((wynik) => (
                      <div
                        key={wynik.id}
                        className="grid grid-cols-3 gap-3 bg-white rounded p-2">
                        <div className="text-center">
                          <div className="font-medium mb-1">Seria</div>
                          <div className="font-semibold">{wynik.serie}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium mb-1">Powtórzenia</div>
                          <div className="font-semibold">
                            {wynik.powtorzenia}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium mb-1">Ciężar</div>
                          <div className="font-semibold">{wynik.ciezar}kg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trzeci wiersz: przycisk zapisu/usunięcia */}
            <div className="w-full flex justify-center">
              {!hasCurrent ? (
                <ZapiszWynikBtn
                  id={row.original.id}
                  serieDane={serieDane}
                  targetDate={targetDate}
                />
              ) : (
                <UsunZapisanyWynikBtn id={current[0].id} />
              )}
            </div>
          </div>
        </div>
      );
    },
  },
];
