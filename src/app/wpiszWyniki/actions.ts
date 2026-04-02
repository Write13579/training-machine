"use server";

import { db } from "@/lib/database";
import { cwiczeniaZDnia, wyniki } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";
import { getMe } from "../authutils";

export async function submitWynik(
  idCwiczeniaDnia: number,
  serieDane: Array<{ powtorzenia: number; ciezar: number }>,
  dataWykonania: Date,
) {
  const user = await getMe();
  if (!user) {
    throw new Error("Nieautoryzowany");
  }

  if (!serieDane.length) {
    return "Dodaj przynajmniej jedną serię";
  }

  if (
    serieDane.some(
      (s) =>
        s.powtorzenia < 0 ||
        s.ciezar < 0 ||
        !Number.isInteger(s.powtorzenia) ||
        !Number.isFinite(s.ciezar),
    )
  ) {
    return "Wyniki nie mogą być ujemne";
  }

  const cwiczenieDnia = await db.query.cwiczeniaZDnia.findFirst({
    where: eq(cwiczeniaZDnia.id, idCwiczeniaDnia),
  });

  if (!cwiczenieDnia) {
    return "Nie znaleziono ćwiczenia w planie";
  }

  await db
    .delete(wyniki)
    .where(
      and(
        eq(wyniki.planId, cwiczenieDnia.dzienPlanId),
        eq(wyniki.exerciseId, cwiczenieDnia.exerciseId),
        eq(wyniki.userId, user.id),
        eq(wyniki.dataWykonania, dataWykonania),
      ),
    );

  await db.insert(wyniki).values(
    serieDane.map((s, idx) => ({
      planId: cwiczenieDnia.dzienPlanId,
      userId: user.id,
      exerciseId: cwiczenieDnia.exerciseId,
      serie: idx + 1,
      powtorzenia: s.powtorzenia,
      ciezar: s.ciezar,
      dataWykonania,
    })),
  );

  return "Wynik zapisany";
}

export async function usunZapisanyWynik(idWyniku: number) {
  const user = await getMe();
  if (!user) {
    throw new Error("Nieautoryzowany");
  }

  const rekord = await db.query.wyniki.findFirst({
    where: and(eq(wyniki.id, idWyniku), eq(wyniki.userId, user.id)),
  });

  if (!rekord) {
    return "Wynik nie istnieje";
  }

  await db
    .delete(wyniki)
    .where(
      and(
        eq(wyniki.planId, rekord.planId),
        eq(wyniki.userId, rekord.userId),
        eq(wyniki.exerciseId, rekord.exerciseId),
        eq(wyniki.dataWykonania, rekord.dataWykonania),
      ),
    );

  return "Wynik usunięty";
}
