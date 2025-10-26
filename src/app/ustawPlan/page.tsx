import { db } from "@/lib/database";
import { DataTable } from "./data-table-plan";
import { getMe } from "../authutils";
import { and, eq } from "drizzle-orm";
import { plans } from "@/lib/database/scheme";

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
      <h1>Ustaw Plan Treningowy</h1>
      <DataTable data={parsedData} listaCwiczen={listaCwiczen} />
    </div>
  );
}
