"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
export default function WykresyComp({
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
  const chartConfig = {
    ciezar: {
      label: "Ciężar",
      color: "#FF4D6D",
    },
  };

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
  );
}
