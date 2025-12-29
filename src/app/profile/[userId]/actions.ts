"use server";

import { getMe } from "@/app/authutils";
import { db } from "@/lib/database";
import { users, usersToUsers, wyniki } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";

export async function przestanObserwowac(ja: number, on: number) {
  const user = await getMe();
  if (!user) {
    throw new Error("Nieautoryzowany");
  }

  await db
    .delete(usersToUsers)
    .where(
      and(
        eq(usersToUsers.osobaObserwujacaId, ja),
        eq(usersToUsers.osobaObserwowanaId, on)
      )
    );

  return "Przestałeś obserwować tego użytkownika";
}

export async function zacznijObserwowac(ja: number, on: string) {
  const user = await getMe();
  if (!user) {
    throw new Error("Nieautoryzowany");
  }

  const goChceObserwowac = await db.query.users.findFirst({
    where: eq(users.login, on),
  });

  if (!goChceObserwowac) {
    return { error: 1, info: "Użytkownik nie znaleziony" };
  }

  if (ja == goChceObserwowac.id) {
    return { error: 1, info: "Nie możesz obserwować samego siebie narcyzie" };
  }

  const existingRelation = await db.query.usersToUsers.findFirst({
    where: and(
      eq(usersToUsers.osobaObserwujacaId, ja),
      eq(usersToUsers.osobaObserwowanaId, goChceObserwowac.id)
    ),
  });
  if (existingRelation) {
    return { error: 1, info: "Już obserwujesz tego użytkownika" };
  }
  await db.insert(usersToUsers).values({
    osobaObserwujacaId: ja,
    osobaObserwowanaId: goChceObserwowac.id,
  });
  return {
    error: 0,
    info: `Zacząłeś obserwować użytkownika ${goChceObserwowac.name}`,
  };
}

export async function share(dataWynikow: Date, przestanUdostepniac?: boolean) {
  const user = await getMe();
  if (!user) {
    throw new Error("Nieautoryzowany");
  }

  const znajdzWyniki = await db.query.wyniki.findMany({
    where: eq(wyniki.dataWykonania, dataWynikow),
  });

  if (znajdzWyniki.length === 0) {
    return { error: 1, info: "Brak wyników do podjecia akcji" };
  }

  if (przestanUdostepniac) {
    await db
      .update(wyniki)
      .set({ udostepniony: false })
      .where(eq(wyniki.dataWykonania, dataWynikow));
    return { error: 0, info: "Przestałeś udostępniać te wyniki" };
  }

  if (znajdzWyniki[0].udostepniony) {
    return { error: 1, info: "Wyniki zostały już udostępnione" };
  }

  znajdzWyniki.forEach(async (wynik) => {
    await db
      .update(wyniki)
      .set({ udostepniony: true })
      .where(eq(wyniki.id, wynik.id));
  });
  return { error: 0, info: "Wyniki zostały udostępnione" };
}
