import { db } from "@/lib/database";
import { plans } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";
import { getMe } from "../authutils";
import WpiszComp from "./WpiszComp";

export default async function WpiszWynikiPage() {
  const user = await getMe();

  if (!user) {
    return <div>wypad</div>; //tego i tak nie widac bo jest zabezpieczone middlewarem
  }

  // stworzyc baze danych na wyniki i ?przekazac do wpisz?

  const data = await db.query.plans.findMany({
    where: and(eq(plans.userId, user.id), eq(plans.activated, true)), //to activated z dystansem narazie, bo przeszlosc bedzie niemozliwa do aktualizacji
    with: { exercise: true },
  });

  return (
    <div className="flex flex-col gap-5">
      <h1>Wybierz dzień tygodnia</h1>
      <div>
        <WpiszComp data={data} />
      </div>
      <div>
        wg selecta wyswietla sie wszystko z dnia z najnowsze unique exerciseId
        (filter albo reduce) ; narazie chyba nie trzeba bo jest status
        activated, gorzej bedzie jak plan sie zmieni i bedziesz chcial zmienic
        plan z przeszlosci: zeby zmieniac przeszlosc trzeba dowalic sort wg
        updatedAt + unique exerciseId
      </div>
    </div>
  );
}
