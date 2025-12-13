"use server";

import { db } from "@/lib/database";
import { exercises, plans, users, wyniki } from "@/lib/database/scheme";
import { eq, inArray } from "drizzle-orm";
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

  await db.delete(plans).where(eq(plans.userId, userId));

  await db.delete(users).where(eq(users.id, userId));
}
