CREATE TABLE "astronomical_houses" (
	"id" serial PRIMARY KEY NOT NULL,
	"season" text NOT NULL,
	"common_name" text NOT NULL,
	"english_name" text,
	"start_date" text NOT NULL,
	"star_name" text NOT NULL,
	"star_days" integer NOT NULL,
	"zodiac_sign" text[],
	"zodiac_days" integer[],
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
