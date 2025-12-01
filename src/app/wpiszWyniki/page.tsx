import { db } from "@/lib/database";
import { plans } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";
import { getMe } from "../authutils";
import WpiszComp from "./WpiszComp";
import { CircleStar } from "lucide-react";

export default async function WpiszWynikiPage() {
  const user = await getMe();

  if (!user) {
    return <div>wypad</div>; //tego i tak nie widac bo jest zabezpieczone middlewarem
  }

  // stworzyc baze danych na wyniki i ?przekazac do wpisz?

  const rawData = await db.query.plans.findMany({
    where: and(eq(plans.userId, user.id), eq(plans.activated, true)), //to activated z dystansem narazie, bo przeszlosc bedzie niemozliwa do aktualizacji
    with: {
      exercise: true,
      wyniki: true,
    },
  });

  // dodanie miejsca na wyniki
  // const data = rawData.map((plan) => ({
  //   ...plan,
  //   // wynik: plan.wyniki[0] || {
  //   //   id: 0,
  //   //   planId: plan.id,
  //   //   serie: 0,
  //   //   powtorzenia: 0,
  //   //   ciezar: 0,
  //   //   dataWykonania: new Date(),
  //   // },
  // }));

  // //wywalanie tych z wpisanymi wynikow
  // const data = preData.filter((item) => {
  //   item.wyniki;
  //   return (
  //     item.wynik.serie == 0 &&
  //     item.wynik.powtorzenia == 0 &&
  //     item.wynik.ciezar == 0
  //   );
  // });

  return (
    <div className="flex flex-col gap-5">
      <h1>Wybierz dzień tygodnia</h1>
      <div>
        wg selecta wyswietla sie wszystko z dnia z najnowsze unique exerciseId
        (filter albo reduce) ; narazie chyba nie trzeba bo jest status
        activated, gorzej bedzie jak plan sie zmieni i bedziesz chcial zmienic
        plan z przeszlosci: zeby zmieniac przeszlosc trzeba dowalic sort wg
        updatedAt + unique exerciseId
      </div>
      <div className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-8 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="flex flex-col items-center mb-6">
          <CircleStar className="w-12 h-12 mb-4" 
          stroke="url(#loginGradient)" 
          strokeWidth={1.8} 
          aria-hidden="true" />
          <h1 className="text-black text-2xl font-bold">Wpisz wyniki</h1>
          <div className="font-MySerif mt-3 mb-6 text-[12px] text-black font-bold">
            Wprowadź nazwę ćwiczenia oraz serie, powtórzenia i ciężar
          </div>
      <div>
        <WpiszComp data={rawData} />
      </div>
        </div>
      </div>
    </div>
    
  );
}
