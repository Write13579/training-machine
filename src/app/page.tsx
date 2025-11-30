import { getMe } from "./authutils";
import WylogujBtn from "@/components/ui/WylogujBtn";
import Link from "next/link";
import ZalogujPage from "./ZalogujComp";
import { Dumbbell } from "lucide-react";
import { db } from "@/lib/database";
import { eq } from "drizzle-orm";
import { usersToUsers, wyniki } from "@/lib/database/scheme";
import { createStringFromDate } from "@/lib/utils";

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
    >
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
    (relacja) => relacja.osobaObserwowanaId
  );

  const udostepnioneWynikiZnajomych = user
    ? Object.values(udostepnioneWynikiWszystkie).filter((wynik) =>
        kogoJaObserwuje.includes(wynik.userId)
      )
    : [];

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
        <div
          className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-8
                 shadow-2xl shadow-black/40 ring-1 ring-black/5">
          <div className="flex flex-col items-center">
            <Dumbbell
              className="w-12 h-12 mb-10"
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

          <Link href="/ustawPlan">
            <button
              type="button"
              className="
                w-full
              py-[8.75px]
              my-2
              rounded-full
              cursor-pointer
              border-0
              bg-black
              uppercase
              text-[15px]
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              hover:text-white
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]
              ">
              Stwórz trening
            </button>
          </Link>

          <Link href="/wpiszWyniki">
            <button
              type="button"
              className="
                w-full
              py-[8.75px]
              my-2
              rounded-full
              cursor-pointer
              border-0
              bg-black
              uppercase
              text-[15px]
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              hover:text-white
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]
              ">
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
                className="w-full
              py-[8.75px]
              my-2
              rounded-full
              cursor-pointer
              border-0
              bg-[#FF4D6D]
              uppercase
              text-[15px]
              text-black
              font-bold
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]">
                Panel administratora
              </button>
            </Link>
          )}
        </div>
      )}
      <div className="border-2 p-3 flex justify-center mx-10 flex-col min-h-[10vh] mt-10">
        <h2 className="font-bold text-xl">
          {user ? "Treningi znajomych" : "Ostatnie udostępnione treningi"}
        </h2>
        <div className="space-y-6">
          {(user ? udostepnioneWynikiZnajomych : ostatnie5Treningow).map(
            (grupa) => (
              <div key={`${grupa.userId}-${grupa.dataString}`}>
                <div>
                  <div>{grupa.userName}</div> wrzucił wyniki z dnia{" "}
                  {grupa.dataString}
                </div>
                <div>
                  {grupa.wyniki.map((wynik) => (
                    <div key={wynik.id}>
                      <span>{wynik.cwiczenie}</span>: {wynik.serie} serii po{" "}
                      {wynik.powtorzenia} powtórzeń po {wynik.ciezar} kg
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
          {user && udostepnioneWynikiZnajomych.length === 0 && (
            <div className="text-gray-500">
              Brak wyników do wyświetlenia. Zacznij obserwować znajomych!
            </div>
          )}
          {!user && ostatnie5Treningow.length === 0 && (
            <div className="text-gray-500">Brak udostępnionych treningów</div>
          )}
        </div>
      </div>
    </div>
  );
}
