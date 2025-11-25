ALTER TABLE "todos" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "is_done" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "date" timestamp;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "updated_at" timestamp DEFAULT now();