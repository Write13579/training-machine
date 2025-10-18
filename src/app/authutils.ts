"use server";

import * as bcrypt from "bcryptjs";
import * as jose from "jose";
import { db } from "@/lib/database";
import { eq } from "drizzle-orm";
import { User, users } from "@/lib/database/scheme";
import { cookies } from "next/headers";
import { generateRandomString } from "@/lib/utils";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(
  inputPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

export type JWTPayload = Pick<User, "id" | "name">;

export async function encode(user: User) {
  const payload: JWTPayload = { id: user.id, name: user.name };

  const iat = Math.floor(Date.now() / 1000);
  const exp = new Date();

  exp.setDate(exp.getDate() + 8);
  exp.setHours(0, 0, 0, 0);

  const token = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

  return token;
}

export async function decode(token: string) {
  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );

  return payload as JWTPayload;
}

export async function getMe() {
  const token = (await cookies()).get("JWTToken")?.value;
  if (!token) {
    return null;
  }
  try {
    const payload = await decode(token);
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });
    return user || null;
  } catch (e) {
    return null;
  }
}

export async function resetujHaslo(userIdDoZmiany: number) {
  const user = await getMe();
  if (!user) {
    throw new Error("unauthorized");
  }
  const newPassword = generateRandomString(8);
  const hashedNewPassword = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ password: hashedNewPassword })
    .where(eq(users.id, userIdDoZmiany));
  return newPassword;
}
