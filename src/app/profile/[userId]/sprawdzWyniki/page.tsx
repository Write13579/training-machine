import { getMe } from "@/app/authutils";
import { db } from "@/lib/database";
import { wyniki } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";
import WybierzDateComp from "./WybierzDateComp";

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

  //   const wszystkieWyniki = await db.query.wyniki.findMany({
  //     with: { plan: true },
  //   });

  //   const wynikiUzytkownika = wszystkieWyniki.filter((wynik) => {
  //     return wynik.plan.userId == userId;
  //   });

  const wynikiUzytkownika = await db.query.wyniki.findMany({
    where: eq(wyniki.userId, userId),
    with: {
      exercise: true,
    },
  });

  return (
    <div>
      <WybierzDateComp wynikiUsera={wynikiUzytkownika} />
    </div>
  );
}
