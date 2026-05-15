import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  varchar,
  integer,
  date,
} from "drizzle-orm/pg-core";

// TABELE

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  login: varchar("login", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  //surname: varchar("surname", { length: 256 }).unique().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  admin: boolean("admin").default(false).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});

export type User = typeof users.$inferSelect;

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  nazwa: varchar("nazwa", { length: 256 }).unique().notNull(),
  opis: varchar("opis", { length: 700 }).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
  createdByUserId: integer("createdByUserId").references(() => users.id),
});

export type Exercise = typeof exercises.$inferSelect;

export const fullPlans = pgTable("fullPlans", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => users.id)
    .notNull(),
  nazwa: varchar("nazwa", { length: 256 }).notNull(),
  activePlan: boolean("activePlan").default(false).notNull(),
});

export type FullPlan = typeof fullPlans.$inferSelect;

//  w zasadzie to dzien z planu tygodniowego
export const daysOfPlans = pgTable("daysOfPlans", {
  id: serial("id").primaryKey(),
  dzienTygodnia: integer("dzienTygodnia").notNull(), // 0 - poniedziałek, 6 - niedziela
  fullPlanId: integer("fullPlanId")
    .references(() => fullPlans.id)
    .notNull(),
});

// Alias kompatybilności dla istniejącego kodu aplikacji.
export const plans = daysOfPlans;

export type Plan = typeof daysOfPlans.$inferSelect;

export type PlanWithExercise = Plan & {
  exercise: Exercise;
  wyniki: Wynik[]; // ?
};

export const cwiczeniaZDnia = pgTable("cwiczeniaZDnia", {
  id: serial("id").primaryKey(),
  dzienPlanId: integer("dzienPlanId")
    .references(() => daysOfPlans.id)
    .notNull(),
  exerciseId: integer("exerciseId")
    .references(() => exercises.id)
    .notNull(),
  kolejnosc: integer("kolejnosc").notNull(),
});

export const serieCwiczenia = pgTable("serieCwiczenia", {
  id: serial("id").primaryKey(),
  cwiczeniaZDniaId: integer("cwiczeniaZDniaId")
    .references(() => cwiczeniaZDnia.id)
    .notNull(),
  serie: integer("serie").notNull(),
  powtorzenia: integer("powtorzenia").notNull(),
  ciezar: integer("ciezar").notNull(),
  kolejnosc: integer("kolejnosc").generatedAlwaysAsIdentity(),
});

export const wyniki = pgTable("wyniki", {
  id: serial("id").primaryKey(),
  planId: integer("planId")
    .references(() => daysOfPlans.id)
    .notNull(),
  userId: integer("userId")
    .references(() => users.id)
    .notNull(),
  exerciseId: integer("exerciseId")
    .references(() => exercises.id)
    .notNull(),
  serie: integer("serie").notNull(),
  powtorzenia: integer("powtorzenia").notNull(),
  ciezar: integer("ciezar").notNull(),
  dataWykonania: date("dataWykonania", { mode: "date" }).notNull(),
  udostepniony: boolean("udostepniony").default(false).notNull(),
  opisUdostepnienia: varchar("opisUdostepnienia", { length: 700 }),
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

export const zgloszenia = pgTable("zgloszenia", {
  id: serial("id").primaryKey(),
  tresc: varchar("tresc", { length: 700 }).notNull(),
  zglaszajacyId: integer("zglaszajacyId")
    .references(() => users.id)
    .notNull(),
  zgloszonyId: integer("zgloszonyId")
    .references(() => users.id)
    .notNull(),
});

// RELACJE

export const usersRelations = relations(users, ({ many }) => ({
  fullPlans: many(fullPlans),
  wyniki: many(wyniki),
  obserwatorzy: many(usersToUsers, {
    relationName: "obserwatorzy",
  }),
  obserwujacy: many(usersToUsers, {
    relationName: "obserwujacy",
  }),
  polubienia: many(polubienia),
  zglaszajacy: many(zgloszenia, {
    relationName: "zglaszajacy",
  }),
  zgloszeni: many(zgloszenia, {
    relationName: "zgloszeni",
  }),
  exercises: many(exercises, {
    relationName: "exercises",
  }),
}));

export const fullPlansRelations = relations(fullPlans, ({ one, many }) => ({
  user: one(users, { fields: [fullPlans.userId], references: [users.id] }),
  daysOfPlans: many(daysOfPlans),
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

export const daysOfPlansRelations = relations(daysOfPlans, ({ one, many }) => ({
  fullPlan: one(fullPlans, {
    fields: [daysOfPlans.fullPlanId],
    references: [fullPlans.id],
  }),
  cwiczeniaZDnia: many(cwiczeniaZDnia),
  wyniki: many(wyniki),
}));

// Alias kompatybilności dla istniejącego kodu aplikacji.
export const plansRelations = daysOfPlansRelations;

export const cwiczeniaZDniaRelations = relations(
  cwiczeniaZDnia,
  ({ one, many }) => ({
    dzien: one(daysOfPlans, {
      fields: [cwiczeniaZDnia.dzienPlanId],
      references: [daysOfPlans.id],
    }),
    exercise: one(exercises, {
      fields: [cwiczeniaZDnia.exerciseId],
      references: [exercises.id],
    }),
    serie: many(serieCwiczenia),
  }),
);

export const serieCwiczeniaRelations = relations(serieCwiczenia, ({ one }) => ({
  cwiczenieZDnia: one(cwiczeniaZDnia, {
    fields: [serieCwiczenia.cwiczeniaZDniaId],
    references: [cwiczeniaZDnia.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ many, one }) => ({
  daysOfPlans: many(daysOfPlans),
  cwiczeniaZDnia: many(cwiczeniaZDnia),
  wyniki: many(wyniki),
  user: one(users, {
    fields: [exercises.createdByUserId],
    references: [users.id],
  }),
}));

export const wynikiRelations = relations(wyniki, ({ one, many }) => ({
  plan: one(daysOfPlans, {
    fields: [wyniki.planId],
    references: [daysOfPlans.id],
  }),
  user: one(users, {
    fields: [wyniki.userId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [wyniki.exerciseId],
    references: [exercises.id],
  }),
  polubienia: many(polubienia),
}));
