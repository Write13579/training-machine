"use server";

import { db } from "@/lib/database";
import { getMe } from "../authutils";
import {
  cwiczeniaZDnia,
  daysOfPlans,
  exercises,
  fullPlans,
} from "@/lib/database/scheme";
import { and, desc, eq } from "drizzle-orm";

export async function dodajCwiczenieDoDniaIPlanu(
  dzien: number,
  nazwaCwiczenia: string,
  nazwaPlanu: string,
) {
  const user = await getMe();

  if (!user) {
    throw new Error("wypad");
  }

  if (dzien < 0 || dzien > 6) {
    throw new Error("Nieprawidlowy dzien tygodnia");
  }

  const znajdzCwiczeniePoNazwie = await db.query.exercises.findFirst({
    where: eq(exercises.nazwa, nazwaCwiczenia),
  });

  if (!znajdzCwiczeniePoNazwie) {
    return [{ error: "Cwiczenie o podanej nazwie nie istnieje" }];
  }

  const istniejePelnyPlan = await db.query.fullPlans.findFirst({
    where: and(eq(fullPlans.userId, user.id), eq(fullPlans.nazwa, nazwaPlanu)),
  });

  if (!istniejePelnyPlan) {
    await db.insert(fullPlans).values({
      userId: user.id,
      nazwa: nazwaPlanu,
    });
  }

  const pelnyPlan =
    istniejePelnyPlan ||
    (await db.query.fullPlans.findFirst({
      where: and(
        eq(fullPlans.userId, user.id),
        eq(fullPlans.nazwa, nazwaPlanu),
      ),
    }));

  if (!pelnyPlan) {
    throw new Error("Nie udalo sie utworzyc planu");
  }

  const dzienPlanu = await db.query.daysOfPlans.findFirst({
    where: and(
      eq(daysOfPlans.dzienTygodnia, dzien),
      eq(daysOfPlans.fullPlanId, pelnyPlan.id),
    ),
  });

  const dayId =
    dzienPlanu?.id ||
    (
      await db
        .insert(daysOfPlans)
        .values({ dzienTygodnia: dzien, fullPlanId: pelnyPlan.id })
        .returning({ id: daysOfPlans.id })
    )[0].id;

  const istniejeCwiczenie = await db.query.cwiczeniaZDnia.findFirst({
    where: and(
      eq(cwiczeniaZDnia.dzienPlanId, dayId),
      eq(cwiczeniaZDnia.exerciseId, znajdzCwiczeniePoNazwie.id),
    ),
  });

  if (istniejeCwiczenie) {
    return [{ error: "Cwiczenie o podanej nazwie juz istnieje w tym planie" }];
  }

  const ostatnie = await db.query.cwiczeniaZDnia.findFirst({
    where: eq(cwiczeniaZDnia.dzienPlanId, dayId),
    orderBy: [desc(cwiczeniaZDnia.kolejnosc)],
  });

  await db.insert(cwiczeniaZDnia).values({
    dzienPlanId: dayId,
    exerciseId: znajdzCwiczeniePoNazwie.id,
    kolejnosc: (ostatnie?.kolejnosc ?? 0) + 1,
  });

  return [];
}

export async function usunCwiczenieZDnia(
  dzien: number,
  nazwaCwiczenia: string,
  nazwaPlanu: string,
) {
  const user = await getMe();
  if (!user) {
    throw new Error("wypad");
  }

  const cwiczenie = await db.query.exercises.findFirst({
    where: eq(exercises.nazwa, nazwaCwiczenia),
  });

  if (!cwiczenie) {
    throw new Error("Cwiczenie nie istnieje");
  }

  const znajdzFullPlan = await db.query.fullPlans.findFirst({
    where: and(eq(fullPlans.userId, user.id), eq(fullPlans.nazwa, nazwaPlanu)),
  });

  if (!znajdzFullPlan) {
    throw new Error("Plan nie istnieje");
  }

  const day = await db.query.daysOfPlans.findFirst({
    where: and(
      eq(daysOfPlans.dzienTygodnia, dzien),
      eq(daysOfPlans.fullPlanId, znajdzFullPlan.id),
    ),
  });

  if (!day) {
    return;
  }

  await db
    .delete(cwiczeniaZDnia)
    .where(
      and(
        eq(cwiczeniaZDnia.dzienPlanId, day.id),
        eq(cwiczeniaZDnia.exerciseId, cwiczenie.id),
      ),
    );
}

export async function aktywujPlan(fullPlanId: number) {
  const user = await getMe();
  if (!user) {
    throw new Error("wypad");
  }

  if (!fullPlanId) {
    return [{ error: "Nie wybrano planu do aktywacji" }];
  }

  const planUsera = await db.query.fullPlans.findFirst({
    where: and(eq(fullPlans.id, fullPlanId), eq(fullPlans.userId, user.id)),
  });

  if (!planUsera) {
    return [{ error: "Nie znaleziono planu uzytkownika" }];
  }

  await db
    .update(fullPlans)
    .set({ activePlan: false })
    .where(eq(fullPlans.userId, user.id));

  await db
    .update(fullPlans)
    .set({ activePlan: true })
    .where(and(eq(fullPlans.userId, user.id), eq(fullPlans.id, fullPlanId)));

  return [];
}
