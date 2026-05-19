import { db } from "@/lib/database";
import { DataTable } from "./data-table-plan";
import { getMe } from "../authutils";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { categories, exercises, fullPlans, plans } from "@/lib/database/scheme";
import { CircleStar } from "lucide-react";
import Link from "next/link";

export default async function UstawPlanPage() {
  const user = await getMe();
  if (!user) {
    return <div>wypad</div>;
  }

  const listaWszystkichKategoriiZCwiczeniami =
    await db.query.categories.findMany({
      where: eq(categories.deleted, false),
      with: { exercises: true },
    });

  const listaWszystkichCwiczen = await db.query.exercises.findMany({
    where: and(eq(exercises.deleted, false), isNull(exercises.category)),
  });

  const listaPlanowUsera = await db.query.fullPlans.findMany({
    where: eq(fullPlans.userId, user.id),
  });

  const fullPlanIds = listaPlanowUsera.map((p) => p.id);

  const data =
    fullPlanIds.length > 0
      ? await db.query.plans.findMany({
          with: { cwiczeniaZDnia: { with: { exercise: true } } },
          where: inArray(plans.fullPlanId, fullPlanIds),
        })
      : [];

  // załóżmy że masz listaPlanowUsera z wcześniejszego zapytania
  const planMap = new Map<number, string>(
    listaPlanowUsera.map((p) => [p.id, p.nazwa]),
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

    for (const cw of p.cwiczeniaZDnia) {
      byDay.get(day)!.push({
        nazwaCwiczenia: cw.exercise.nazwa,
        nazwaPlanu,
      });
    }
  }

  const parsedData = Array.from(byDay.entries()).map(([day, list]) => ({
    dzień: day,
    ćwiczenia: list,
  }));

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
        <div className="flex flex-col items-center">
          <CircleStar
            className="w-12 h-12 mb-4"
            stroke="url(#loginGradient)"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <h1 className="text-center text-black text-2xl font-bold">
            Modyfikuj plan treningowy
          </h1>
        </div>
        <DataTable
          data={parsedData}
          listaWszystkichCwiczen={listaWszystkichCwiczen}
          listaPlanowUsera={listaPlanowUsera}
          listaKategoriiZCwiczeniami={listaWszystkichKategoriiZCwiczeniami}
        />
      </div>
    </div>
  );
}
