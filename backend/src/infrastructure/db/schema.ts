import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// routes: basic route data
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  route_id: varchar("route_id", { length: 64 }).notNull(),
  fuel_type: varchar("fuel_type", { length: 32 }).notNull(),
  year: integer("year").notNull(),
  vessel_type: varchar("vessel_type", { length: 32 }).notNull(),
  ghg_intensity: numeric("ghg_intensity", {
    precision: 10,
    scale: 4,
  }).notNull(),
  is_baseline: boolean("is_baseline").default(false).notNull(),
  fuel_consumption: decimal("fuel_consumption", {
    precision: 10,
    scale: 2,
  }).notNull(),
  distance: decimal("distance", { precision: 10, scale: 2 }).notNull(),
  total_emissions: decimal("total_emissions", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

// ship_compliance: computed CB records per ship/year
export const shipCompliance = pgTable("ship_compliance", {
  id: serial("id").primaryKey(),
  ship_id: varchar("ship_id", { length: 64 }).notNull(),
  year: integer("year").notNull(),
  cb_gco2eq: numeric("cb_gco2eq", { precision: 20, scale: 4 }).notNull(),
});

// bank_entries: records of banked surplus (or negative for applied)
export const bankEntries = pgTable("bank_entries", {
  id: serial("id").primaryKey(),
  ship_id: varchar("ship_id", { length: 64 }).notNull(),
  year: integer("year").notNull(),
  amount_gco2eq: numeric("amount_gco2eq", {
    precision: 20,
    scale: 4,
  }).notNull(),
});

// pools: registry of pooling operations (one per pool)
export const pools = pgTable("pools", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// pool_members: allocations per pool
export const poolMembers = pgTable("pool_members", {
  id: serial("id").primaryKey(),
  pool_id: integer("pool_id")
    .references(() => pools.id)
    .notNull(),
  ship_id: varchar("ship_id", { length: 64 }).notNull(),
  cb_before: numeric("cb_before", { precision: 20, scale: 4 }).notNull(),
  cb_after: numeric("cb_after", { precision: 20, scale: 4 }).notNull(),
});

// Type helpers
export type RouteModel = InferSelectModel<typeof routes>;
export type NewRoute = InferInsertModel<typeof routes>;

export type ShipComplianceModel = InferSelectModel<typeof shipCompliance>;
export type NewShipCompliance = InferInsertModel<typeof shipCompliance>;

export type BankEntryModel = InferSelectModel<typeof bankEntries>;
export type NewBankEntry = InferInsertModel<typeof bankEntries>;

export type PoolModel = InferSelectModel<typeof pools>;
export type NewPool = InferInsertModel<typeof pools>;

export type PoolMemberModel = InferSelectModel<typeof poolMembers>;
export type NewPoolMember = InferInsertModel<typeof poolMembers>;
