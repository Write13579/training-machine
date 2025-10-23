"use server";

import { db } from "@/lib/database";
import { getMe } from "../authutils";
import { exercises, plans } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";

export async function dodajCwiczenieDoDnia(
  dzien: number,
  nazwaCwiczenia: string
) {
  const user = await getMe();

  if (!user) {
    throw new Error("wypad");
  }

  if (dzien < 0 || dzien > 6) {
    throw new Error("Nieprawidłowy dzień tygodnia");
  }

  const znajdzCwiczeniePoNazwie = await db.query.exercises.findFirst({
    where: eq(exercises.nazwa, nazwaCwiczenia),
  });

  if (!znajdzCwiczeniePoNazwie) {
    return [{ error: "Ćwiczenie o podanej nazwie nie istnieje" }];
  }

  const istniejeCwiczenie = await db.query.plans.findFirst({
    where: and(
      eq(plans.dzienTygodnia, dzien),
      eq(plans.userId, user.id),
      eq(plans.exerciseId, znajdzCwiczeniePoNazwie.id)
    ),
  });

  if (istniejeCwiczenie) {
    return [{ error: "Ćwiczenie o podanej nazwie już istnieje" }];
  }

  await db.insert(plans).values({
    userId: user.id,
    dzienTygodnia: dzien,
    exerciseId: znajdzCwiczeniePoNazwie.id,
  });

  return [];
}

export async function usunCwiczenieZDnia(dzien: number, nazwa: string) {
  const user = await getMe();
  if (!user) {
    throw new Error("wypad");
  }

  const cwiczenie = await db.query.exercises.findFirst({
    where: eq(exercises.nazwa, nazwa),
  });

  if (!cwiczenie) {
    throw new Error("Ćwiczenie nie istnieje");
  }

  await db
    .delete(plans)
    .where(
      and(
        eq(plans.dzienTygodnia, dzien),
        eq(plans.userId, user.id),
        eq(plans.exerciseId, cwiczenie.id)
      )
    );
}
