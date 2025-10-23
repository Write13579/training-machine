import { db } from "@/lib/database";
import { columns } from "./columns";
import { DataTable } from "./data-table-plan";
import { getMe } from "../authutils";
import { eq } from "drizzle-orm";
import { plans } from "@/lib/database/scheme";

export default async function UstawPlanPage() {
  const user = await getMe();
  if (!user) {
    return <div>wypad</div>;
  }

  const data = await db.query.plans.findMany({
    with: { exercise: true },
    where: eq(plans.userId, user.id),
  });
  //console.log(data);

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
      <DataTable columns={columns} data={parsedData} />
    </div>
  );
}
