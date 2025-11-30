"use server";

import { db } from "@/lib/database";
import { getMe } from "./authutils";
import { and, eq } from "drizzle-orm";
import { polubienia } from "@/lib/database/scheme";

export async function polubTrening(idWyniku: number) {
  const user = await getMe();
  if (!user) {
    throw new Error("User not logged in");
  }

  const czyIstniejeJuzToPolubienie = await db.query.polubienia.findFirst({
    where: and(
      eq(polubienia.osobaLubiacaId, user.id),
      eq(polubienia.wynikId, idWyniku)
    ),
  });

  if (czyIstniejeJuzToPolubienie) {
    await db
      .delete(polubienia)
      .where(
        and(
          eq(polubienia.osobaLubiacaId, user.id),
          eq(polubienia.wynikId, idWyniku)
        )
      );
    return { lubi: 0, message: "Przetales lubić ten wynik" };
  } else {
    await db.insert(polubienia).values({
      osobaLubiacaId: user.id,
      wynikId: idWyniku,
    });
    return { lubi: 1, message: "Polubiono wynik" };
  }
}
