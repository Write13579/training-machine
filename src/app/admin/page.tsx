import { db } from "@/lib/database";
import { getMe } from "../authutils";
import CreateExComp from "./CreateExComp";
import DeleteExComp from "./DeleteExComp";
import Link from "next/link";
import { House } from "lucide-react";

export default async function AdminPage() {
  const user = await getMe();

  const alleEercises = await db.query.exercises.findMany();

  if (!user || !user.admin) {
    return <h1>Access Denied</h1>; // tu nic nie rob w ui bo i tak tego nie bedzie widac
  }

  return (
    <div>
      <h1 className="font-bold flex justify-center">Admin Page</h1>
      <Link href="/">
        <House />
      </Link>
      {/* mozesz pod tym walnąć grida i zrobic kafelki 2x3 albo cos takiego, bo nwm ile bedzie tych admin funkcji */}
      <div className="border-2 border-black p-4 rounded-md shadow-md m-8">
        {/* ^zrob komponent na takie kwadraty administracyjne zamiast osobnych divów i to zmapować raz */}
        <CreateExComp />
        <div className="overflow-y-scroll max-h-[250px]">
          {/* ^docen */}
          <h1 className="font-bold mb-1">Existing Exercises</h1>
          {alleEercises.map((ex) => (
            <div key={ex.id} className="flex items-center">
              <div id="cwiczenie">
                {ex.nazwa} - {ex.opis}
                {/*walnij tu jakies ladne to zeby to ladnie wygladalo */}
              </div>
              <DeleteExComp exerciseId={ex.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
