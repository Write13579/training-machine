import { db } from "@/lib/database";
import { DataTable } from "./data-table-plan";
import { getMe } from "../authutils";
import { and, eq } from "drizzle-orm";
import { plans } from "@/lib/database/scheme";
import { CircleStar} from "lucide-react";
import Link from "next/link";

export default async function UstawPlanPage() {
  const user = await getMe();
  if (!user) {
    return <div>wypad</div>;
  }

  const data = await db.query.plans.findMany({
    with: { exercise: true },
    where: and(eq(plans.userId, user.id), eq(plans.activated, true)),
  });

  const listaCwiczen = await db.query.exercises.findMany();

  // Grupowanie po dniu + deduplikacja nazw ćwiczeń
  const byDay = new Map<number, Set<string>>(
    Array.from({ length: 7 }, (_, i) => [i, new Set<string>()])
  );

  // Wypełnianie danymi z bazy
  data.forEach((p) => {
    const day = p.dzienTygodnia;
    if (day >= 0 && day <= 6) {
      byDay.get(day)!.add(p.exercise.nazwa);
    }
  });

  const parsedData = Array.from(byDay.entries()).map(([day, names]) => ({
    dzień: day,
    ćwiczenia: Array.from(names),
  }));

  return (
    <div>
      <Link
        href="/"
        className="relative z-20 mx-auto mt-6 w-full px-4 max-w-[640px] md:max-w-[900px] lg:max-w-[1100px] block"
      >
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
          <h1 className="text-black text-2xl font-bold">Ustaw plan treningowy</h1>
          <div className="font-MySerif mt-3 text-[12px] text-[#858383] font-bold">
            Wybierz ćwiczenia i przypisz do dni tygodnia
          </div>
        </div>
        <DataTable data={parsedData} listaCwiczen={listaCwiczen} />
        <div>
          UWAGA: przed zmianą tego planu upewnij się, że wpisałeś wszystkie
          zaległe wyniki, bo po zmianie planu będzie to niemożliwe.
        </div>
      </div>
    </div>
  );
}
