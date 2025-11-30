import { WynikType } from "@/app/wpiszWyniki/columns";
import { id } from "date-fns/locale";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  varchar,
  integer,
  date,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// TABELE

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  login: varchar("login", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  admin: boolean("admin").default(false).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
});

export type User = typeof users.$inferSelect;

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  nazwa: varchar("nazwa", { length: 256 }).unique().notNull(),
  opis: varchar("opis", { length: 700 }).notNull(),
});

export type Exercise = typeof exercises.$inferSelect;

//  w zasadzie to dzien z planu tygodniowego
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => users.id)
    .notNull(),
  dzienTygodnia: integer("dzienTygodnia").notNull(), // 0 - poniedziałek, 6 - niedziela
  exerciseId: integer("exerciseId")
    .references(() => exercises.id)
    .notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  activated: boolean("activated").default(true).notNull(),
});

export type Plan = typeof plans.$inferSelect;

export type PlanWithExercise = Plan & {
  exercise: Exercise;
  wyniki: Wynik[]; // ?
};

export const wyniki = pgTable("wyniki", {
  id: serial("id").primaryKey(),
  planId: integer("planId")
    .references(() => plans.id)
    .notNull(),
  serie: integer("serie").notNull(),
  powtorzenia: integer("powtorzenia").notNull(),
  ciezar: integer("ciezar").notNull(),
  dataWykonania: date("dataWykonania", { mode: "date" }).notNull(),
  udostepniony: boolean("udostepniony").default(false).notNull(),
});

export type Wynik = typeof wyniki.$inferSelect;

// obserwacje
export const usersToUsers = pgTable("usersToUsers", {
  id: serial("id").primaryKey(),
  osobaObserwujacaId: integer("osobaObserwujacaId")
    .references(() => users.id)
    .notNull(),
  osobaObserwowanaId: integer("osobaObserwowanaId")
    .references(() => users.id)
    .notNull(),
});

export type UserToUser = typeof usersToUsers.$inferSelect;

//polubienia - userToWynik
export const polubienia = pgTable("polubienia", {
  id: serial("id").primaryKey(),
  osobaLubiacaId: integer("osobaLubiacaId")
    .references(() => users.id)
    .notNull(),
  wynikId: integer("wynikId")
    .references(() => wyniki.id)
    .notNull(),
});

export type Polubienie = typeof polubienia.$inferSelect;

// RELACJE

export const usersRelations = relations(users, ({ many }) => ({
  plans: many(plans),
  obserwatorzy: many(usersToUsers, {
    relationName: "obserwatorzy",
  }),
  obserwujacy: many(usersToUsers, {
    relationName: "obserwujacy",
  }),
  polubienia: many(polubienia),
}));

export const polubieniaRelations = relations(polubienia, ({ one }) => ({
  osobaLubiacaId: one(users, {
    fields: [polubienia.osobaLubiacaId],
    references: [users.id],
  }),
  wynik: one(wyniki, { fields: [polubienia.wynikId], references: [wyniki.id] }),
}));

export const usersToUsersRelations = relations(usersToUsers, ({ one }) => ({
  obserwatorzy: one(users, {
    fields: [usersToUsers.osobaObserwujacaId],
    references: [users.id],
    relationName: "obserwatorzy",
  }),
  obserwujacy: one(users, {
    fields: [usersToUsers.osobaObserwowanaId],
    references: [users.id],
    relationName: "obserwujacy",
  }),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  user: one(users, { fields: [plans.userId], references: [users.id] }),
  exercise: one(exercises, {
    fields: [plans.exerciseId],
    references: [exercises.id],
  }),
  wyniki: many(wyniki),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  plans: many(plans),
}));

export const wynikiRelations = relations(wyniki, ({ one, many }) => ({
  plan: one(plans, { fields: [wyniki.planId], references: [plans.id] }),
  polubienia: many(polubienia),
}));
