"use server";

import { db } from "@/lib/database";
import { users } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { encode, getMe, hashPassword, verifyPassword } from "./authutils";

export async function sprawdzLogowanie(login: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.login, login),
  });
  if (!user) {
    return [{ field: "login", error: "podany login nie istnieje" }];
  }
  const correctPassword = await verifyPassword(password, user.password);

  if (!correctPassword) {
    return [{ field: "haslo", error: "podane hasło jest nieprawidłowe" }];
  }
  const token = await encode(user);

  const exp = new Date();

  exp.setDate(exp.getDate() + 8);
  exp.setHours(0, 0, 0, 0);

  (await cookies()).set("JWTToken", token, { expires: exp });
  return [];
}

export async function zmienHaslo(stareHaslo: string, noweHaslo: string) {
  const user = await getMe();
  if (!user) {
    return [];
  }
  const correctOldPassword = await verifyPassword(stareHaslo, user.password);
  const correctNewPassword = noweHaslo.length >= 4 || noweHaslo.length <= 25;

  if (!correctOldPassword) {
    return [{ field: "stareHaslo", error: "podane hasło jest nieprawidłowe" }];
  }
  if (!correctNewPassword) {
    return [{ field: "noweHaslo", error: "zla ilosc znakow" }];
  }

  const noweHasloHashed = await hashPassword(noweHaslo);
  await db
    .update(users)
    .set({ password: noweHasloHashed })
    .where(eq(users.id, user.id));
  return [];
}

export async function Wyloguj() {
  (await cookies()).delete("JWTToken");
}
