"use server";

import { db } from "@/lib/database";
import { getMe } from "../authutils";
import { exercises, fullPlans, plans } from "@/lib/database/scheme";
import { and, eq } from "drizzle-orm";

export async function dodajCwiczenieDoDniaIPlanu(
  dzien: number,
  nazwaCwiczenia: string,
  nazwaPlanu: string
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

  const istniejePelnyPlan = await db.query.fullPlans.findFirst({
    where: and(eq(fullPlans.userId, user.id), eq(fullPlans.nazwa, nazwaPlanu)),
  });

  if (!istniejePelnyPlan) {
    await db.insert(fullPlans).values({
      userId: user.id,
      nazwa: nazwaPlanu,
    });
  }

  const istniejeCwiczenie = await db.query.plans.findFirst({
    where: and(
      eq(plans.dzienTygodnia, dzien),
      eq(plans.userId, user.id),
      eq(plans.exerciseId, znajdzCwiczeniePoNazwie.id),
      eq(
        plans.fullPlanId,
        istniejePelnyPlan?.id ||
          (await db.query.fullPlans.findFirst({
            where: and(eq(fullPlans.userId, user.id)),
          }))!.id
      )
    ),
  });

  // if (istniejeCwiczenie && istniejeCwiczenie.activated) {
  //   return [{ error: "Ćwiczenie o podanej nazwie już istnieje" }];
  // }

  // if (istniejeCwiczenie && !istniejeCwiczenie.activated) {
  //   await db
  //     .update(plans)
  //     .set({ activated: true })
  //     .where(eq(plans.id, istniejeCwiczenie.id));
  // } else {
  //   await db.insert(plans).values({
  //     userId: user.id,
  //     dzienTygodnia: dzien,
  //     exerciseId: znajdzCwiczeniePoNazwie.id,
  //     fullPlanId: 1, //tymczasowo
  //   });
  // }

  if (istniejeCwiczenie) {
    return [{ error: "Ćwiczenie o podanej nazwie już istnieje w tym planie" }];
  }

  await db.insert(plans).values({
    userId: user.id,
    dzienTygodnia: dzien,
    exerciseId: znajdzCwiczeniePoNazwie.id,
    fullPlanId:
      istniejePelnyPlan?.id ||
      (await db.query.fullPlans.findFirst({
        where: and(
          eq(fullPlans.userId, user.id),
          eq(fullPlans.nazwa, nazwaPlanu)
        ),
      }))!.id,
  });

  return [];
}

export async function usunCwiczenieZDnia(
  dzien: number,
  nazwaCwiczenia: string,
  nazwaPlanu: string
) {
  const user = await getMe();
  if (!user) {
    throw new Error("wypad");
  }

  const cwiczenie = await db.query.exercises.findFirst({
    where: eq(exercises.nazwa, nazwaCwiczenia),
  });

  if (!cwiczenie) {
    throw new Error("Ćwiczenie nie istnieje");
  }

  const znajdzFullPlan = await db.query.fullPlans.findFirst({
    where: and(eq(fullPlans.userId, user.id), eq(fullPlans.nazwa, nazwaPlanu)),
  });

  if (!znajdzFullPlan) {
    throw new Error("Plan nie istnieje");
  }

  await db
    .update(plans)
    .set({ addedToPlan: false })
    .where(
      and(
        eq(plans.dzienTygodnia, dzien),
        eq(plans.userId, user.id),
        eq(plans.exerciseId, cwiczenie.id),
        eq(plans.fullPlanId, znajdzFullPlan.id)
      )
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

  await db
    .update(plans)
    .set({ activePlan: false })
    .where(and(eq(plans.userId, user.id), eq(plans.activePlan, true)));

  await db
    .update(plans)
    .set({ activePlan: true })
    .where(
      and(
        eq(plans.userId, user.id),
        eq(plans.fullPlanId, fullPlanId),
        eq(plans.addedToPlan, true)
      )
    );

  return [];
}
