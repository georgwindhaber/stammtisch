import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: integer("user_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("member"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const drinks = sqliteTable("drinks", {
  drinkId: integer("drink_id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  userId: integer("user_id").references(() => users.userId),
  value: integer("value").notNull().default(1),
});

export const rounds = sqliteTable("rounds", {
  roundId: integer("round_id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  userId: integer("user_id").references(() => users.userId),
  value: integer("value").notNull().default(1),
});

export const paid = sqliteTable("paid", {
  paidId: integer("paid_id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  userId: integer("user_id").references(() => users.userId),
  value: integer("value").notNull().default(1),
});
