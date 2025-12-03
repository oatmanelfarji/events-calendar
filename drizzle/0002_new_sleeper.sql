CREATE TYPE "public"."category" AS ENUM('national', 'religious', 'family', 'personal', 'other');--> statement-breakpoint
ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_category_id_categories_id_fk";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" "category" DEFAULT 'personal';--> statement-breakpoint
