"use server";

import { db } from "@/lib/database";
import { users } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { encode, getMe, hashPassword, verifyPassword } from "./authutils";

export async function zarejestruj(
  login: string,
  name: string,
  email: string,
  password: string,
  passAgain: string
) {
  const existingLogin = await db.query.users.findFirst({
    where: eq(users.login, login),
  });

  if (existingLogin) {
    return [{ field: "login", error: "podany login jest już zajęty" }];
  }

  const existingName = await db.query.users.findFirst({
    where: eq(users.name, name),
  });

  if (existingName) {
    return [
      { field: "name", error: "podana nazwa użytkownika jest już zajęta" },
    ];
  }

  if (!email.includes("@") || !email.includes(".")) {
    return [{ field: "email", error: "podany email jest nieprawidłowy" }];
  }

  const existingEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingEmail) {
    return [{ field: "email", error: "podany email jest już zajęty" }];
  }

  if (password !== passAgain) {
    return [{ field: "potworzHaslo", error: "podane hasła nie są identyczne" }];
  }

  if (password.length < 4 || password.length > 25) {
    return [{ field: "haslo", error: "hasło musi mieć od 4 do 25 znaków" }];
  }

  //

  await db.insert(users).values({
    login: login,
    name: name,
    email: email,
    password: await hashPassword(password),
  });

  return [];
}

export async function sprawdzLogowanie(
  login: string,
  password: string,
  zapamietajHaslo: boolean
) {
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

  zapamietajHaslo
    ? exp.setDate(exp.getDate() + 31)
    : exp.setDate(exp.getDate() + 1);
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
