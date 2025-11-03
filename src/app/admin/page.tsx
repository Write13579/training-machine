import { db } from "@/lib/database";
import { getMe } from "../authutils";
import CreateExComp from "./CreateExComp";
import DeleteExComp from "./DeleteExComp";
import Link from "next/link";
import { House,FolderCode, User} from "lucide-react";
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
    <div className="w-[84%] mx-auto max-w-[100%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col min-h-[360px] w-full">
            <CreateExComp/>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 min-h-[360px] w-full">
          <div className="flex flex-col items-center mb-6 mt-10">
        <FolderCode
                    className="w-12 h-12 mb-4"
                    stroke="url(#loginGradient)"
                    strokeWidth={1.8}
                    aria-hidden="true"
              />
        <div className="text-black text-2xl md:text-3xl font-bold">
          Ćwiczenia
        </div>
        <div className="font-MySerif mt-5 mb-1 text-[12px] text-[#858383] font-bold">
            Lista wszystkich ćwiczeń w bazie
          </div>
      </div>
          <div className="pt-1 overflow-y-auto max-h-[320px] space-y-1 ">
            {allExercises.map((ex) => (
              <div key={ex.id} className="flex items-center justify-between py-1">
                <div id="cwiczenie" className="text-black truncate text-1xl md:text-1xl font-bold">
                  {ex.nazwa} - {ex.opis}
                </div>
                <DeleteExComp exerciseId={ex.id} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 min-h-[360px] w-full sm:col-span-2 lg:col-span-1">
          <div className="flex flex-col items-center mb-6 mt-10">
        <User
                    className="w-12 h-12 mb-4"
                    stroke="url(#loginGradient)"
                    strokeWidth={1.8}
                    aria-hidden="true"
              />
        <div className="text-black text-2xl md:text-3xl font-bold">
          Użytkownicy
        </div>
        <div className="font-MySerif mt-5 mb-1 text-[12px] text-[#858383] font-bold">
            Lista wszystkich użytkowników w bazie
          </div>
      </div>
          <div className="pt-1 overflow-y-auto max-h-[320px] space-y-1 ">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-1 min-w-0">
                <div id="uzytkownik" className="text-black truncate text-1xl md:text-1xl font-bold">
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
