import { db } from "@/lib/database";
import { getMe } from "../authutils";
import CreateExComp from "./CreateExComp";
import DeleteExComp from "./DeleteExComp";
import Link from "next/link";
import { FolderCode, User } from "lucide-react";
import DeleteUserComp from "./DeleteUserComp";
import { categories, exercises, users, wyniki } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";
import { formatujSlowoCwiczenieWgLiczby } from "@/lib/utils";
import UsunZgloszonyWynikBtn from "./UsunZgloszonyWynikBtn";
import UsunZgloszenieBtn from "./UsunZgloszenieBtn";
import CreateCategoryComp from "./CreateCategoryComp";
import DeleteCategoryComp from "./DeleteCategoryComp";

export default async function AdminPage() {
  const user = await getMe();

  const allExercises = await db.query.exercises.findMany({
    where: eq(exercises.deleted, false),
  });

  const allUsers = await db.query.users.findMany({
    where: eq(users.deleted, false),
    columns: {
      id: true,
      name: true,
      login: true,
    },
  });

  const allCategories = await db.query.categories.findMany({
    where: eq(categories.deleted, false),
  });

  type Report = {
    id: number;
    tresc: string;
    zglaszajacy: {
      id: number;
      name: string;
      login: string;
    };
    zgloszonyWynik: {
      id: number;
      opisUdostepnienia: string | null;
      dataWykonania: Date;
      wyniki: {
        id: number;
        exercise: {
          id: number;
          nazwa: string;
        };
        serie: number;
        powtorzenia: number;
        ciezar: number;
      }[];
    };
  };

  const allReportsRaw = await db.query.zgloszenia.findMany({
    columns: {
      id: true,
      tresc: true,
    },
    with: {
      zglaszajacy: {
        columns: {
          id: true,
          name: true,
          login: true,
        },
      },
      zgloszonyWynik: {
        columns: {
          id: true,
          opisUdostepnienia: true,
          dataWykonania: true,
        },
      },
    },
  });

  const allReports: Report[] = await Promise.all(
    allReportsRaw.map(async (report) => {
      const wynikiZDnia = await db.query.wyniki.findMany({
        where: eq(wyniki.dataWykonania, report.zgloszonyWynik.dataWykonania),
        columns: {
          id: true,
          serie: true,
          powtorzenia: true,
          ciezar: true,
        },
        with: {
          exercise: {
            columns: {
              id: true,
              nazwa: true,
            },
          },
        },
      });

      return {
        ...report,
        zgloszonyWynik: {
          ...report.zgloszonyWynik,
          wyniki: wynikiZDnia,
        },
      };
    }),
  );

  if (!user || !user.admin) {
    return <h1>Access Denied</h1>; // tu nic nie rob w ui bo i tak tego nie bedzie widac
  }

  return (
    <div className="w-[84%] mx-auto max-w-[100%] mt-10">
      <div className="mb-4 w-full block lg:hidden">
        <Link href="/" className="block w-full">
          <button
            type="button"
            className="w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
            Powrót
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col min-h-[360px] w-full">
          <CreateExComp categories={allCategories} />
        </div>

        <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col min-h-[360px] w-full">
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
              <div
                key={ex.id}
                className="flex items-center justify-between py-1 min-w-0">
                <div
                  id="cwiczenie"
                  className="text-black truncate text-1xl md:text-1xl font-bold">
                  {ex.nazwa} - {ex.opis}
                </div>
                <DeleteExComp exerciseId={ex.id} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col gap-2 min-h-[360px] w-full sm:col-span-2 lg:col-span-1">
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
              <div
                key={u.id}
                className="flex items-center justify-between py-1 min-w-0">
                <div
                  id="uzytkownik"
                  className="text-black truncate text-1xl md:text-1xl font-bold">
                  {u.name} ({u.login})
                </div>
                <DeleteUserComp userId={u.id} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col min-h-[360px] w-full">
          <div className="flex flex-col items-center mb-6 mt-10">
            <FolderCode
              className="w-12 h-12 mb-4"
              stroke="url(#loginGradient)"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <div className="text-black text-2xl md:text-3xl font-bold">
              Zgłoszenia
            </div>
            <div className="font-MySerif mt-5 mb-1 text-[12px] text-[#858383] font-bold">
              Lista wszystkich zgłoszeń w bazie
            </div>
          </div>
          <div className="pt-1 overflow-y-auto max-h-[320px] space-y-1 ">
            {allReports.map((report) => (
              <div
                key={report.id}
                className="rounded-[16px] border border-black/10 bg-[#FFF6F8] px-3 py-2 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-black text-sm font-semibold truncate">
                      {report.zglaszajacy.name} ({report.zglaszajacy.login})
                    </div>
                    <div
                      id="zgloszenie"
                      className="text-black truncate text-sm font-bold mt-1">
                      opis zgłoszenia:{report.tresc}
                    </div>
                    <div className="text-[11px] text-black/70 mt-1 truncate">
                      {report.zgloszonyWynik.wyniki.length}{" "}
                      {formatujSlowoCwiczenieWgLiczby(
                        report.zgloszonyWynik.wyniki.length,
                      )}{" "}
                      z dnia{" "}
                      {report.zgloszonyWynik.dataWykonania.toLocaleDateString()}
                    </div>
                    <div className="mt-2 space-y-1">
                      {report.zgloszonyWynik.wyniki.map((wynik) => (
                        <div
                          key={wynik.id}
                          className="text-[11px] text-black/80 truncate">
                          {wynik.exercise.nazwa} - {wynik.powtorzenia}x
                          {wynik.ciezar}kg
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <UsunZgloszonyWynikBtn wynikId={report.zgloszonyWynik.id} />
                <UsunZgloszenieBtn reportId={report.id} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col min-h-[360px] w-full">
          <CreateCategoryComp />
        </div>
        <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col gap-2 min-h-[360px] w-full sm:col-span-2 lg:col-span-1">
          <div className="flex flex-col items-center mb-6 mt-10">
            <User
              className="w-12 h-12 mb-4"
              stroke="url(#loginGradient)"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <div className="text-black text-2xl md:text-3xl font-bold">
              Kategorie
            </div>
            <div className="font-MySerif mt-5 mb-1 text-[12px] text-[#858383] font-bold">
              Lista wszystkich kategorii w bazie
            </div>
          </div>
          <div className="pt-1 overflow-y-auto max-h-[320px] space-y-1 ">
            {allCategories.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between py-1 min-w-0">
                <div
                  id="uzytkownik"
                  className="text-black truncate text-1xl md:text-1xl font-bold">
                  {u.nazwa}
                </div>
                <DeleteCategoryComp categoryId={u.id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 mx-auto w-full sm:w-1/2 lg:w-1/3 hidden lg:block">
        <Link href="/" className="block w-full">
          <button
            type="button"
            className=" w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
            Powrót
          </button>
        </Link>
      </div>
    </div>
  );
}
