import { db } from "@/lib/database";
import { users, usersToUsers } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";
import PrzestanObserwowacBtn from "./PrzestanObserwowacBtn";
import DodajZnajomegoComp from "./DodajZnajomegoComp";
import Link from "next/link";
import { getMe } from "@/app/authutils";
import { BadgeCheck, Clipboard, Dumbbell } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: { userId: number };
}) {
  const { userId } = await params;

  const ja = await getMe();

  if (!ja) {
    throw new Error("Nieautoryzowany");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    // with: {
    //   obserwujacy: true, // kogo ja
    //   obserwatorzy: true, // kto mnie
    // },
  });

  const moiObserwatorzy = await db.query.usersToUsers.findMany({
    where: eq(usersToUsers.osobaObserwowanaId, userId),
    with: {
      obserwatorzy: true,
    },
  });

  const osobyKtoreObserwuje = await db.query.usersToUsers.findMany({
    where: eq(usersToUsers.osobaObserwujacaId, userId),
    with: {
      obserwujacy: true,
    },
  });

  //const usersAll = await db.query.users.findMany();

  if (!user) {
    return <div>User not found</div>;
  }

  //console.log(userId, ja.id); //ty ja nwm czemu userId to string a ja.id to number wg servera xddd

  return (
    <div className="w-[84%] mx-auto max-w-[100%]">
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
        <div className="flex flex-col items-center mb-6 mt-5">
        <Dumbbell
          className="w-12 h-12 mb-4"
          stroke="url(#loginGradient)"
          strokeWidth={1.8}
          aria-hidden="true"/>
        
        <div className="text-black text-2xl md:text-3xl font-bold">
          Profil
        </div>
        <div className="font-MySerif mt-5 mb-10 text-[12px] text-[#858383] font-bold">
          Coś tu można napisać o profilu
        </div>
      </div>
      <div className="text-[#FF4D6D] inline-block text-4xl md:text-4xl font-bold leading-tight">{user.name}</div>
      <div className="text-[#C9184A] inline-block text-4xl md:text-4xl font-bold leading-tight">{user.login}</div>

      <div id="znajdz wynik treningu po dacie"
      className=" w-full py-[17px] rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[100ms]">
        <Link href={`/profile/${userId}/sprawdzWyniki`}>
          Sprawdz {userId == ja.id && "swoje"} wyniki{" "}
          {userId != ja.id && "użytkownika"}
        </Link>
      </div>
      <div>liczba obserwatorów: {moiObserwatorzy.length}</div>
      {moiObserwatorzy.length > 0 && (
        <div id="kto mnie obserwuje">
          <div>obserwują mnie:</div>
          <div>
            {moiObserwatorzy.map((relacja) => (
              <div
                key={`${relacja.osobaObserwowanaId}-${relacja.osobaObserwujacaId}`}>
                <Link href={`/profile/${relacja.obserwatorzy.id}`}>
                  {relacja.obserwatorzy.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col min-h-[360px] w-full">
        <div className="flex flex-col items-center mt-10">
        <BadgeCheck
          className="w-12 h-12 mb-4"
          stroke="url(#loginGradient)"
          strokeWidth={1.8}
          aria-hidden="true"/>
        
        <div className="text-black text-2xl md:text-3xl font-bold">
          Obserwuję
        </div>
        <div className="font-MySerif mt-5 mb-10 text-[12px] text-[#858383] font-bold">
          Zarządzaj swoimi obserwowanymi
        </div>
      </div>
      {osobyKtoreObserwuje.length > 0 && (
        <div id="kogo ja obserwuje">
          <div className="pt-1 overflow-y-auto max-h-[320px] space-y-1">
            {osobyKtoreObserwuje.map((relacja) => (
              <div
              className="flex items-center justify-between p-1"
                id="wrapper"
                key={`${relacja.osobaObserwujacaId}-${relacja.osobaObserwowanaId}`}>
                <Link href={`/profile/${relacja.obserwujacy.id}`}
                className="text-black truncate text-1xl md:text-1xl font-bold">
                  {relacja.obserwujacy.name}
                </Link>
                <div>
                  <PrzestanObserwowacBtn
                    ja={userId}
                    on={relacja.osobaObserwowanaId}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      
      <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col min-h-[360px] w-full">
        <div className="flex flex-col items-center mb-6 mt-5">
        <Clipboard
          className="w-12 h-12 mb-4"
          stroke="url(#loginGradient)"
          strokeWidth={1.8}
          aria-hidden="true"/>
        
        <div className="text-black text-2xl md:text-3xl font-bold">
          Wyszukaj
        </div>
        <div className="font-MySerif mt-5 mb-10 text-[12px] text-[#858383] font-bold">
          Dodaj nowych znajomych
        </div>
      </div>
      {userId == ja.id && (
        <div id="dodajZnajomego w sensie ze obserwuj wiesz jak jest byku eszkere">
          <DodajZnajomegoComp ja={userId} />
        </div>
      )}
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
