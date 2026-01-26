import { getMe } from "./authutils";
import WylogujBtn from "@/components/ui/WylogujBtn";
import Link from "next/link";
import ZalogujPage from "./ZalogujComp";
import { Dumbbell } from "lucide-react";
import { db } from "@/lib/database";
import { eq } from "drizzle-orm";
import { usersToUsers, wyniki } from "@/lib/database/scheme";
import { createStringFromDate } from "@/lib/utils";
import PulubBtn from "./PolubBtn";

export default async function Home() {
  const user = await getMe();

  const udostepnioneWynikiWszystkieQuery = await db.query.wyniki.findMany({
    with: {
      plan: { with: { exercise: true, user: true } },
    },
    where: eq(wyniki.udostepniony, true),
  });

  const udostepnioneWynikiWszystkie = udostepnioneWynikiWszystkieQuery.reduce(
    (acc, wynik) => {
      const userId = wynik.plan.userId;
      const dataKey = createStringFromDate(wynik.dataWykonania);
      const key = `${userId}-${dataKey}`;

      if (!acc[key]) {
        acc[key] = {
          userId: userId,
          userName: wynik.plan.user.name,
          data: wynik.dataWykonania,
          dataString: dataKey,
          wyniki: [],
        };
      }

      acc[key].wyniki.push({
        id: wynik.id,
        cwiczenie: wynik.plan.exercise.nazwa,
        serie: wynik.serie,
        powtorzenia: wynik.powtorzenia,
        ciezar: wynik.ciezar,
      });

      return acc;
    },
    {} as Record<
      string,
      {
        userId: number;
        userName: string;
        data: Date;
        dataString: string;
        wyniki: Array<{
          id: number;
          cwiczenie: string;
          serie: number;
          powtorzenia: number;
          ciezar: number;
        }>;
      }
    >,
  );

  // 5 ostatnich treningów od kogokolwiek
  const ostatnie5Treningow = Object.values(udostepnioneWynikiWszystkie)
    .sort((a, b) => b.data.getTime() - a.data.getTime())
    .slice(0, 5);

  const kogoJaObserwujeQuery = user
    ? await db.query.usersToUsers.findMany({
        where: eq(usersToUsers.osobaObserwujacaId, user.id),
      })
    : [];

  const kogoJaObserwuje = kogoJaObserwujeQuery.map(
    (relacja) => relacja.osobaObserwowanaId,
  );

  const udostepnioneWynikiZnajomych = user
    ? Object.values(udostepnioneWynikiWszystkie).filter((wynik) =>
        kogoJaObserwuje.includes(wynik.userId),
      )
    : [];

  const polubieniaWszystkie = await db.query.polubienia.findMany();

  const mojePolubienia = await polubieniaWszystkie.filter(
    (polubienie) => polubienie.osobaLubiacaId === user?.id,
  );

  function liczbaPolubienWyniku(wynikId: number) {
    return polubieniaWszystkie.filter(
      (polubienie) => polubienie.wynikId === wynikId,
    ).length;
  }

  return (
    <div
      id="tlo"
      className="relative items-center justify-center min-h-[100vh] min-w-[320px]">
      {!user && (
        <div className="flex flex-col items-center w-full">
          <ZalogujPage />
        </div>
      )}
      {user && (
        <div className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-4 shadow-2xl shadow-black/40 ring-1 ring-black/5">
          <div className="flex flex-col items-center">
            <Dumbbell
              className="w-12 h-12 mb-10 mt-5"
              stroke="url(#loginGradient)"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="text-center">
            <div className="text-black text-3xl md:text-4xl font-bold leading-tight mb-2">
              WITAJ PONOWNIE
            </div>
            <div className="text-[#FF4D6D] inline-block text-4xl md:text-4xl font-bold leading-tight">
              <Link href={`/profile/${user.id}`}>{user.name}</Link>
            </div>
          </div>

          <div className="flex flex-col items-center font-MySerif mt-3 mb-10 text-[12px] text-[#858383] font-bold">
            Stwórz swój plan treningowy i śledź postępy!
          </div>

          <Link href={`/profile/${user.id}`}>
            <button
              type="button"
              className="w-full py-[8.75px] my-2 rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms] ">
              Profil treningowy
            </button>
          </Link>

          <Link href="/ustawPlan">
            <button
              type="button"
              className="w-full py-[8.75px] my-2 rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms] ">
              Stwórz trening
            </button>
          </Link>

          <Link href="/wpiszWyniki">
            <button
              type="button"
              className="w-full py-[8.75px] my-2 rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms] ">
              Wpisz wyniki treningu
            </button>
          </Link>
          <div>
            <WylogujBtn />
          </div>
          {user && user.admin && (
            <Link href="/admin">
              <button
                type="button"
                className="w-full py-[8.75px] my-2 rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
                Panel administratora
              </button>
            </Link>
          )}
        </div>
      )}
      <section className="w-full px-4 flex justify-center">
        <div className="w-[54%] min-w-[340px]">
          <h2 className="text-black font-bold items-center bg-white rounded-[20px] shadow-md shadow-black/40 ring-1 ring-black/5 p-4 flex flex-col gap-4 mt-10 mb-4">
            {user ? "Treningi znajomych" : "Ostatnie udostępnione treningi"}
          </h2>

          <div className="space-y-4">
            {(user ? udostepnioneWynikiZnajomych : ostatnie5Treningow).map(
              (grupa) => (
                <article
                  key={`${grupa.userId}-${grupa.dataString}`}
                  className="bg-white rounded-[20px] shadow-md shadow-black/40 ring-1 ring-black/5 p-4 flex flex-col gap-4">
                  <div className="flex flex-row items-start gap-4">
                    <div className="flex-none">
                      <div
                        id={`${grupa.userId}-avatar`}
                        className="w-12 h-12 rounded-full bg-[#FF4D6D] flex items-center justify-center text-white font-bold">
                        {grupa.userName
                          ?.split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    </div>
                    {/** username i data */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-black font-MySerif font-semibold text-base">
                            {grupa.userName}
                          </div>
                          <div className="text-sm text-black mt-1">
                            {grupa.dataString}
                          </div>
                        </div>
                        {/** polubienia */}

                        <div className="flex items-center">
                          <div className="text-[16px] font-bold text-black">
                            {liczbaPolubienWyniku(grupa.wyniki[0].id)}
                          </div>

                          <PulubBtn
                            user={user}
                            wynikId={grupa.wyniki[0].id}
                            mojeLajki={mojePolubienia ?? []}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 w-full">
                    {grupa.wyniki.map((wynik) => (
                      <div
                        key={wynik.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#FF4D6D] text-white rounded-[20px] px-3 py-2 gap-2 ">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm sm:text-base font-medium whitespace-normal break-words text-center sm:text-left px-3 py-1">
                            {wynik.cwiczenie}
                          </div>
                        </div>

                        <div className="flex items-center justify-center sm:justify-end gap-3">
                          <div className="flex flex-col items-center px-2">
                            <div className="text-lg sm:text-xl font-bold leading-none">
                              {wynik.serie}
                            </div>
                            <div className="text-[11px]">Serie</div>
                          </div>

                          <div className="flex flex-col items-center px-2">
                            <div className="text-lg sm:text-xl font-bold leading-none">
                              {wynik.powtorzenia}
                            </div>
                            <div className="text-[11px]">Powtórzenia</div>
                          </div>

                          <div className="flex flex-col items-center px-2">
                            <div className="text-lg sm:text-xl font-bold leading-none">
                              {wynik.ciezar}kg
                            </div>
                            <div className="text-[11px]">Ciężar</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ),
            )}

            {user && udostepnioneWynikiZnajomych.length === 0 && (
              <div className="flex justify-center bg-[#FF4D6D] text-white rounded-[20px] px-3 py-2 gap-2 text-sm sm:text-base font-medium whitespace-normal break-words text-center shadow-md shadow-black/40 ring-1 ring-black/5">
                Brak wyników do wyświetlenia. Zacznij obserwować znajomych!
              </div>
            )}
            {!user && ostatnie5Treningow.length === 0 && (
              <div className="flex justify-center bg-[#FF4D6D] text-white rounded-[20px] px-3 py-2 gap-2 text-sm sm:text-base font-medium whitespace-normal break-words text-center shadow-md shadow-black/40 ring-1 ring-black/5" />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
