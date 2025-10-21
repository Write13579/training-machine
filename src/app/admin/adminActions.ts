"use server";

import { db } from "@/lib/database";
import { exercises } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";

export async function createExercise(name: string, description: string) {
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
