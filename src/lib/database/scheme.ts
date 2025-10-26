import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  varchar,
  integer,
  date,
  timestamp,
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

// RELACJE

export const usersRelations = relations(users, ({ many }) => ({
  plans: many(plans),
}));

export const plansRelations = relations(plans, ({ one }) => ({
  user: one(users, { fields: [plans.userId], references: [users.id] }),
  exercise: one(exercises, {
    fields: [plans.exerciseId],
    references: [exercises.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  plans: many(plans),
}));
