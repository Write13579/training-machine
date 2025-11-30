"use server";

import { db } from "@/lib/database";
import { wyniki } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";
import { getMe } from "../authutils";
import { revalidatePath } from "next/cache";

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

  if (serie < 0 || powtorzenia < 0 || ciezar < 0) {
    return "Wyniki nie mogą być ujemne";
  }

  if (serie === 0 && (powtorzenia > 0 || ciezar > 0)) {
    return "Jak mogłeś zrobić zero serii i wpisać powtórzenia lub ciężar?";
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

export async function usunZapisanyWynik(idWyniku: number) {
  const user = await getMe();
  if (!user) {
    throw new Error("Nieautoryzowany");
  }

  await db.delete(wyniki).where(eq(wyniki.id, idWyniku));
  return "Wynik usunięty";
}
