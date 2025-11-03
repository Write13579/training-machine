import { db } from "@/lib/database";
import { getMe } from "../authutils";
import CreateExComp from "./CreateExComp";
import DeleteExComp from "./DeleteExComp";
import Link from "next/link";
import { Dumbbell, House } from "lucide-react";
import DeleteUserComp from "./DeleteUserComp";

export default async function AdminPage() {
  const user = await getMe();

  const allExercises = await db.query.exercises.findMany();

  const allUsers = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      login: true,
    },
  });

  if (!user || !user.admin) {
    return <h1>Access Denied</h1>; // tu nic nie rob w ui bo i tak tego nie bedzie widac
  }

  return (
    <div className="w-[90%] mx-auto max-w-[100%]">
      <Link href="/" className="self-start">
        <House />
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-3 min-h-[360px] w-full">
          <div>
            <CreateExComp/>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 min-h-[360px] w-full">
          <h2 className="font-semibold">Existing Exercises</h2>
          <div className="overflow-y-auto max-h-[220px] space-y-2">
            {allExercises.map((ex) => (
              <div key={ex.id} className="flex items-center justify-between py-1 min-w-0">
                <div id="cwiczenie" className="text-sm truncate">
                  {ex.nazwa} - {ex.opis}
                </div>
                <DeleteExComp exerciseId={ex.id} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 min-h-[360px] w-full sm:col-span-2 lg:col-span-1">
          <h2 className="font-semibold">Existing Users</h2>
          <div className="overflow-y-auto max-h-[220px] space-y-2">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-1 min-w-0">
                <div id="uzytkownik" className="text-sm truncate">
                  {u.name} ({u.login})
                </div>
                <DeleteUserComp userId={u.id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
