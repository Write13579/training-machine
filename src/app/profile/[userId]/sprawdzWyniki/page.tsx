import { getMe } from "@/app/authutils";
import { db } from "@/lib/database";
import { plans, wyniki } from "@/lib/database/scheme";
import { and, eq, exists } from "drizzle-orm";
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
    where: exists(
      db
        .select()
        .from(plans)
        .where(and(eq(plans.id, wyniki.planId), eq(plans.userId, userId)))
    ),
    with: {
      plan: {
        with: { exercise: true },
      },
    },
  });

  return (
    <div>
      <WybierzDateComp wynikiUsera={wynikiUzytkownika} />
    </div>
  );
}
