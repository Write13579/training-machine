"use server";

import { db } from "@/lib/database";
import { getMe } from "../authutils";
import { plans } from "@/lib/database/scheme";

export async function dodajCwiczenieDoDnia(dzien: number) {
  const user = await getMe();

  if (!user) {
    throw new Error("wypad");
  }

  if (dzien < 0 || dzien > 6) {
    throw new Error("Nieprawidłowy dzień tygodnia");
  }

  await db.insert(plans).values({
    userId: user.id,
    dzienTygodnia: dzien,
    exerciseId: 1, // przemigrować to na popup z wyborem ćwiczenia xd
  });
}
