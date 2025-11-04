"use server";

import { db } from "@/lib/database";
import { wyniki } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";
import { getMe } from "../authutils";

export async function submitWynik(
  idPlanu: number, // tu jest exerciseId zapisane
  serie: number,
  powtorzenia: number,
  ciezar: number,
  dataWykonania: Date
) {
  const user = await getMe();
  if (!user) {
    throw new Error("Nieautoryzowany");
  }

  const existingRecord = await db.query.wyniki.findFirst({
    where: and(
      eq(wyniki.planId, idPlanu),
      eq(wyniki.dataWykonania, dataWykonania)
    ),
  });

  if (existingRecord) {
    await db
      .update(wyniki)
      .set({
        serie: serie,
        powtorzenia: powtorzenia,
        ciezar: ciezar,
      })
      .where(eq(wyniki.id, existingRecord.id));

    return "Wynik zaktualizowany";
  }

  await db.insert(wyniki).values({
    planId: idPlanu,
    serie: serie,
    powtorzenia: powtorzenia,
    ciezar: ciezar,
    dataWykonania: dataWykonania,
  });
  return "Wynik zapisany";
}
