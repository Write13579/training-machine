import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  login: varchar("login", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  admin: boolean("admin").default(false).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
});

export type User = typeof users.$inferSelect;

// export const infos = pgTable("infos", {
//   id: serial("id").primaryKey(),
//   tytul: varchar("tytul", { length: 256 }).notNull(),
//   tresc: varchar("tresc", { length: 700 }).notNull(),
//   createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
// });
