import { db } from "@/lib/database";
import { DataTable } from "./data-table-plan";
import { getMe } from "../authutils";
import { and, eq } from "drizzle-orm";
import { fullPlans, plans } from "@/lib/database/scheme";
import { CircleStar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UstawPlanPage() {
  const user = await getMe();
  if (!user) {
    return <div>wypad</div>;
  }

  const data = await db.query.plans.findMany({
    with: { exercise: true },
    where: and(eq(plans.userId, user.id), eq(plans.activated, true)),
  });

  const listaWszystkichCwiczen = await db.query.exercises.findMany();

  const listaPlanowUsera = await db.query.fullPlans.findMany({
    where: eq(fullPlans.userId, user.id),
  });

  // załóżmy że masz listaPlanowUsera z wcześniejszego zapytania
  const planMap = new Map<number, string>(
    listaPlanowUsera.map((p) => [p.id, p.nazwa])
  );

  // Map: dzień → lista ćwiczeń (obiekty)
  const byDay = new Map<
    number,
    { nazwaCwiczenia: string; nazwaPlanu: string }[]
  >(Array.from({ length: 7 }, (_, i) => [i, []]));

  for (const p of data) {
    const day = p.dzienTygodnia;
    if (day < 0 || day > 6) continue;

    const nazwaPlanu = planMap.get(p.fullPlanId) ?? "Brak nazwy";

    byDay.get(day)!.push({
      nazwaCwiczenia: p.exercise.nazwa,
      nazwaPlanu,
    });
  }

  const parsedData = Array.from(byDay.entries()).map(([day, list]) => ({
    dzień: day,
    ćwiczenia: list,
  }));

  console.log(parsedData);

  return (
    <div>
      <Link
        href="/"
        className="relative z-20 mx-auto mt-6 w-[34%] min-w-[340px] block">
        <span className="inline-block w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold text-center transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
          Powrót
        </span>
      </Link>
      <div className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] py-8 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="flex flex-col items-center mb-6">
          <CircleStar
            className="w-12 h-12 mb-4"
            stroke="url(#loginGradient)"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <h1 className="text-center text-black text-2xl font-bold">
            Edytuj/utwórz plan treningowy
          </h1>
          <div className="font-MySerif mt-3 text-[12px] text-[#858383] font-bold">
            wybierz plan do edycji
          </div>
        </div>
        <DataTable
          data={parsedData}
          listaWszystkichCwiczen={listaWszystkichCwiczen}
          listaPlanowUsera={listaPlanowUsera}
        />
        <Button className="bg-red-500">AKTYWUJ</Button>
        <div>
          UWAGA: przed zmianą tego planu upewnij się, że wpisałeś wszystkie
          zaległe wyniki, bo po zmianie planu będzie to niemożliwe.
        </div>
      </div>
    </div>
  );
}
