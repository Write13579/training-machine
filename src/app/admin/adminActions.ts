"use server";

import { db } from "@/lib/database";
import {
  exercises,
  plans,
  users,
  wyniki,
  polubienia,
  zgloszenia,
} from "@/lib/database/scheme";
import { eq, and, inArray } from "drizzle-orm";
import { getMe } from "../authutils";

export async function createExercise(name: string, description: string) {
  const user = await getMe();

  if (!user || !user.admin) {
    throw new Error("Access Denied");
  }

  if (name.length < 1) {
    return [{ field: "name", error: "Nazwa nie może być pusta" }];
  }

  if (description.length < 1) {
    return [{ field: "description", error: "Opis nie może być pusty" }];
  }

  if (!isNaN(parseFloat(name))) {
    return [{ field: "name", error: "Nazwa nie może być liczbą" }];
  }

  if (!isNaN(parseFloat(description))) {
    return [{ field: "description", error: "Opis nie może być liczbą" }];
  }

  const existingExercise = await db.query.exercises.findFirst({
    where: eq(exercises.nazwa, name),
  });

  if (existingExercise) {
    return [{ field: "name", error: "Podana nazwa już istnieje" }];
  }

  await db.insert(exercises).values({
    nazwa: name,
    opis: description,
  });

  return [];
}

export async function deleteExercise(exerciseId: number) {
  const user = await getMe();

  if (!user || !user.admin) {
    throw new Error("Access Denied");
  }

  await db
    .update(exercises)
    .set({ deleted: true })
    .where(eq(exercises.id, exerciseId));
}

export async function deleteUser(userId: number) {
  const user = await getMe();

  if (!user || !user.admin) {
    throw new Error("Access Denied");
  }

  await db.update(users).set({ deleted: true }).where(eq(users.id, userId));
}

export async function deleteWynik(wynikId: number) {
  const user = await getMe();

  if (!user || !user.admin) {
    throw new Error("Access Denied");
  }

  // find the target wynik to determine user and date
  const target = await db.query.wyniki.findFirst({
    where: eq(wyniki.id, wynikId),
    columns: { id: true, userId: true, dataWykonania: true },
  });

  if (!target) {
    return { message: "Wynik nie istnieje" };
  }

  // find all wyniki for that user and date
  const dayWyniki = await db.query.wyniki.findMany({
    where: and(
      eq(wyniki.userId, target.userId),
      eq(wyniki.dataWykonania, target.dataWykonania),
    ),
    columns: { id: true },
  });

  const ids = dayWyniki.map((w) => w.id);

  if (ids.length > 0) {
    await db.delete(polubienia).where(inArray(polubienia.wynikId, ids));
    await db
      .delete(zgloszenia)
      .where(inArray(zgloszenia.zgloszonyWynikId, ids));
    await db.delete(wyniki).where(inArray(wyniki.id, ids));
  }

  return { message: `Usunięto ${ids.length} wyników z dnia` };
}

export async function deleteReport(reportId: number) {
  const user = await getMe();
  if (!user || !user.admin) {
    throw new Error("Access Denied");
  }

  await db.delete(zgloszenia).where(eq(zgloszenia.id, reportId));

  return { message: "Zgłoszenie zostało usunięte" };
}
