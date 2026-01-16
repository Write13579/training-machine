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
import { ChevronDownIcon } from "lucide-react";
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
    serie: number;
    powtorzenia: number;
    ciezar: number;
    dataWykonania: Date;
    udostepniony: boolean;
    plan: {
      id: number;
      userId: number;
      dzienTygodnia: number;
      exerciseId: number;
      addedAt: Date;
      updatedAt: Date;
      activePlan: boolean;
      addedToPlan: boolean;
      fullPlanId: number;
      exercise: {
        id: number;
        nazwa: string;
        opis: string;
      };
    };
  }[];
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const chartConfig = {
    ciezar: {
      label: "Ciężar",
      color: "#16a34a",
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
    [searchParams]
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
  const chartsWithOverallData = wynikiUsera.reduce((acc, wynik) => {
    const cwiczenie = wynik.plan.exercise.nazwa;

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
  }, {} as Record<string, { cwiczenie: string; wyniki: Array<{ ciezar: number; data: Date; serie: number; powtorzenia: number }> }>);

  const chartsArray = Object.values(chartsWithOverallData);

  return (
    <div>
      <div >
        <div className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-8 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="flex text-xl justify-center align-center">
          Sprawdz wyniki z dnia
        </div>
        <div>wybierz date</div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal">
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
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
                        }-${date.getFullYear()}`
                      )
                  );
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-10">
        <h2 className="font-bold mb-4">
          Wyniki z {date?.toLocaleDateString()}
        </h2>
        {wynikiDoWyswietlenia.length > 0 ? (
          wynikiDoWyswietlenia.map((wynik) => (
            <div key={wynik.id} className="mb-4 p-4 border rounded-lg">
              <div className="font-bold">{wynik.plan.exercise.nazwa}</div>
              <div>Serii: {wynik.serie}</div>
              <div>Powtórzeń: {wynik.powtorzenia}</div>
              <div>Ciężar: {wynik.ciezar} kg</div>
            </div>
          ))
        ) : (
          <div>Brak wyników</div>
        )}

        <div>
          {wynikiDoWyswietlenia.length > 0 &&
          !wynikiDoWyswietlenia[0].udostepniony ? (
            <Button
              onClick={async () => {
                const response = await share(
                  wynikiDoWyswietlenia[0].dataWykonania
                );
                toast(response.info);
                router.refresh();
              }}>
              udostępnij swoje wyniki / ten trening nwm
            </Button>
          ) : (
            <div>
              <div>Wyniki zostały już udostępnione</div>
              <Button
                onClick={async () => {
                  const przestanUdostepniac = true;
                  const response = await share(
                    wynikiDoWyswietlenia[0].dataWykonania,
                    przestanUdostepniac
                  );
                  toast(response.info);
                  router.refresh();
                }}>
                Przestan udostepniac
              </Button>
            </div>
          )}
        </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">
            Wszystkie cwiczenia na podstawie progresu nie wiem nazwij to jakos
          </h2>

          {chartsArray.map((item) => {
            const chartData = item.wyniki.map((wynik) => ({
              data: wynik.data.toLocaleDateString(),
              ciezar: wynik.ciezar,
            }));

            return (
              //kajtuś te charty mają byc mniejsze i bardziej czytelne. pozdro z fartem
              <div key={item.cwiczenie} className="mb-8 p-4 border rounded-lg">
                <h3 className="text-xl font-bold mb-4">{item.cwiczenie}</h3>

                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full">
                  <BarChart data={chartData} className="max-h-[300px]">
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Bar
                      dataKey="ciezar"
                      fill={chartConfig.ciezar.color}
                      radius={4}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
