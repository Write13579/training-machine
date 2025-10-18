"use client";

import { createContext, useContext } from "react";
import { type User } from "@/lib/database/scheme";

export const AuthContext = createContext<User | null>(null);

export default function AuthProvider({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: User | null;
}>) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
