"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, CircleStar } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { share } from "../actions";
import { toast } from "sonner";

export default function WybierzDateComp({
  wynikiUsera,
}: {
  wynikiUsera: {
    id: number;
    planId: number;
    userId: number;
    exerciseId: number;
    serie: number;
    powtorzenia: number;
    ciezar: number;
    dataWykonania: Date;
    udostepniony: boolean;
    exercise: {
      id: number;
      nazwa: string;
      opis: string;
    };
  }[];
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const chartConfig = {
    ciezar: {
      label: "Ciężar",
      color: "#FF4D6D",
    },
  };

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  // Filtruj wyniki dla wybranej daty
  const wynikiDoWyswietlenia = useMemo(() => {
    if (!date) return [];

    return wynikiUsera.filter((wynik) => {
      return (
        wynik.dataWykonania.getDate() === date.getDate() &&
        wynik.dataWykonania.getMonth() === date.getMonth() &&
        wynik.dataWykonania.getFullYear() === date.getFullYear()
      );
    });
  }, [wynikiUsera, date]);

  // Grupowanie wyników po ćwiczeniach - przechowuj cały obiekt
  const chartsWithOverallData = wynikiUsera.reduce(
    (acc, wynik) => {
      const cwiczenie = wynik.exercise.nazwa;

      if (!acc[cwiczenie]) {
        acc[cwiczenie] = {
          cwiczenie: cwiczenie,
          wyniki: [],
        };
      }

      acc[cwiczenie].wyniki.push({
        ciezar: wynik.ciezar,
        data: wynik.dataWykonania,
        serie: wynik.serie,
        powtorzenia: wynik.powtorzenia,
      });

      return acc;
    },
    {} as Record<
      string,
      {
        cwiczenie: string;
        wyniki: Array<{
          ciezar: number;
          data: Date;
          serie: number;
          powtorzenia: number;
        }>;
      }
    >,
  );

  const chartsArray = Object.values(chartsWithOverallData);

  return (
    <div
      id="tlo"
      className="relative items-center justify-center min-h-[100vh] min-w-[320px]">
      <div className="relative z-20 mx-auto mt-6 w-[34%] min-w-[340px] block">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="inline-block w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold text-center transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
          Powrót
        </Button>
      </div>
      <div className="relative z-20 mx-auto mt-10 h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-4 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="text-center">
          <CircleStar
            className="w-12 h-12 mb-4 mx-auto"
            stroke="url(#loginGradient)"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <div className="text-black text-2xl font-bold">Wyniki z dnia</div>
          <div className="font-MySerif mt-3 text-[12px] text-[#858383] font-bold">
            Wybierz datę
          </div>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full my-2 py-[8.75px] rounded-full cursor-pointer border-0 bg-black text-white uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
              {date ? date.toLocaleDateString() : "Wybierz datę"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
                date &&
                  router.push(
                    pathname +
                      "?" +
                      createQueryString(
                        "data",
                        `${date.getDate()}-${
                          date.getMonth() + 1
                        }-${date.getFullYear()}`,
                      ),
                  );
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <section className="w-full px-4 flex justify-center">
        <div className="w-[54%] min-w-[340px]">
          <h2 className="text-black font-bold items-center bg-white rounded-[20px] shadow-md shadow-black/40 ring-1 ring-black/5 p-4 flex flex-col gap-4 mt-10 mb-4">
            Wyniki z {date?.toLocaleDateString()}
          </h2>

          <div className="space-y-4">
            {wynikiDoWyswietlenia.length > 0 ? (
              wynikiDoWyswietlenia.map((wynik) => (
                <div
                  key={wynik.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#FF4D6D] text-white rounded-[20px] px-3 py-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium whitespace-normal break-words text-center sm:text-left px-3 py-1">
                      {wynik.exercise.nazwa}
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-end gap-3">
                    <div className="flex flex-col items-center px-2">
                      <div className="text-lg sm:text-xl font-bold leading-none">
                        {wynik.serie}
                      </div>
                      <div className="text-[11px]">Serie</div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="text-lg sm:text-xl font-bold leading-none">
                        {wynik.powtorzenia}
                      </div>
                      <div className="text-[11px]">Powtórzenia</div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="text-lg sm:text-xl font-bold leading-none">
                        {wynik.ciezar}kg
                      </div>
                      <div className="text-[11px]">Ciężar</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center bg-[#FF4D6D] text-white rounded-[20px] px-3 py-2 gap-2 text-sm sm:text-base font-medium whitespace-normal break-words text-center shadow-md shadow-black/40 ring-1 ring-black/5">
                Brak wyników
              </div>
            )}
          </div>

          <div className="mt-10">
            <div>
              {wynikiDoWyswietlenia.length > 0 &&
              !wynikiDoWyswietlenia[0].udostepniony ? (
                <Button
                  onClick={async () => {
                    const response = await share(
                      wynikiDoWyswietlenia[0].dataWykonania,
                    );
                    toast(response.info);
                    router.refresh();
                  }}
                  className="w-full my-2 py-[8.75px] rounded-full cursor-pointer border-0 bg-black text-white uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
                  Udostępnij swoje wyniki
                </Button>
              ) : wynikiDoWyswietlenia.length > 0 ? (
                <div>
                  <div className="text-black font-bold items-center bg-white rounded-[20px] shadow-md shadow-black/40 ring-1 ring-black/5 p-4 flex flex-col gap-4 mb-2">
                    Wyniki zostały już udostępnione
                  </div>
                  <Button
                    onClick={async () => {
                      const przestanUdostepniac = true;
                      const response = await share(
                        wynikiDoWyswietlenia[0].dataWykonania,
                        przestanUdostepniac,
                      );
                      toast(response.info);
                      router.refresh();
                    }}
                    className="w-full my-2 py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
                    Przestań udostępniać
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 flex justify-center">
        <div className="w-[54%] min-w-[340px]">
          <h2 className="text-black font-bold items-center bg-white rounded-[20px] shadow-md shadow-black/40 ring-1 ring-black/5 p-4 flex flex-col gap-4 mb-4">
            Wszystkie ćwiczenia - postęp
          </h2>

          <div className="space-y-4">
            {chartsArray.map((item) => {
              const chartData = item.wyniki.map((wynik) => ({
                data: wynik.data.toLocaleDateString(),
                ciezar: wynik.ciezar,
              }));

              return (
                <article
                  key={item.cwiczenie}
                  className="bg-white rounded-[20px] shadow-md shadow-black/40 ring-1 ring-black/5 p-4 flex flex-col gap-4">
                  <h3 className="text-black font-bold text-base">
                    {item.cwiczenie}
                  </h3>

                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full">
                    <BarChart data={chartData} className="max-h-[300px]">
                      <XAxis dataKey="data" stroke="#000" />
                      <YAxis stroke="#000" />
                      <Bar
                        dataKey="ciezar"
                        fill={chartConfig.ciezar.color}
                        radius={4}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
