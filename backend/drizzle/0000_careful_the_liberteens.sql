CREATE TABLE "bank_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"ship_id" varchar(64) NOT NULL,
	"year" integer NOT NULL,
	"amount_gco2eq" numeric(20, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pool_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"pool_id" integer NOT NULL,
	"ship_id" varchar(64) NOT NULL,
	"cb_before" numeric(20, 4) NOT NULL,
	"cb_after" numeric(20, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pools" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" varchar(64) NOT NULL,
	"fuel_type" varchar(32) NOT NULL,
	"year" integer NOT NULL,
	"vessel_type" varchar(32) NOT NULL,
	"ghg_intensity" numeric(10, 4) NOT NULL,
	"is_baseline" boolean DEFAULT false NOT NULL,
	"fuel_consumption" numeric(10, 2) NOT NULL,
	"distance" numeric(10, 2) NOT NULL,
	"total_emissions" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ship_compliance" (
	"id" serial PRIMARY KEY NOT NULL,
	"ship_id" varchar(64) NOT NULL,
	"year" integer NOT NULL,
	"cb_gco2eq" numeric(20, 4) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("id") ON DELETE no action ON UPDATE no action;