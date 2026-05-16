import { db } from "@/lib/database";
import { fullPlans, plans } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";
import { getMe } from "../authutils";
import WpiszComp from "./WpiszComp";
import { CircleStar } from "lucide-react";
import Link from "next/link";

export default async function WpiszWynikiPage() {
  const user = await getMe();

  if (!user) {
    return <div>wypad</div>; //tego i tak nie widac bo jest zabezpieczone middlewarem
  }

  // stworzyc baze danych na wyniki i ?przekazac do wpisz?

  const aktywnyPlan = await db.query.fullPlans.findFirst({
    where: and(eq(fullPlans.userId, user.id), eq(fullPlans.activePlan, true)),
  });

  const rawData = aktywnyPlan
    ? await db.query.plans.findMany({
        where: eq(plans.fullPlanId, aktywnyPlan.id),
        with: {
          cwiczeniaZDnia: { with: { exercise: true } },
          wyniki: true,
        },
      })
    : [];

  const data = rawData.flatMap((dayPlan) =>
    dayPlan.cwiczeniaZDnia.map((cw) => ({
      id: cw.id,
      dzienTygodnia: dayPlan.dzienTygodnia,
      exerciseId: cw.exerciseId,
      exercise: cw.exercise,
      wyniki: dayPlan.wyniki.filter((w) => w.exerciseId === cw.exerciseId),
    })),
  );

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
      <Link
        href="/"
        className="relative z-20 mx-auto mt-6 w-[34%] min-w-[340px] block">
        <span className="inline-block w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold text-center transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
          Powrót
        </span>
      </Link>
      <div className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-8 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="flex flex-col mb-6 items-center">
          <CircleStar
            className="w-12 h-12 mb-4 mx-auto"
            stroke="url(#loginGradient)"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <h1 className="text-black text-2xl font-bold ">
            Wpisz wyniki treningów
          </h1>
          <div className="font-MySerif mt-3 text-[12px] text-[#858383] font-bold">
            Uzupełnij wyniki swojego treningu, aby śledzić postępy i analizować
            swoje osiągnięcia.
          </div>
          <div className="mt-3">
            <WpiszComp data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
