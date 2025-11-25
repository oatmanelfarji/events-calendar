import {
	boolean,
	date,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const holidays = pgTable("holidays", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	// localName: text("local_name"),
	date: date("date").notNull(),
	countryCode: text("country_code").notNull(),
	type: text("type"), // e.g., 'public', 'religious'
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
	// updatedAt: timestamp("updated_at").defaultNow(),

	// Sync fields
	// syncId: text("sync_id"), // ID from external provider
	// source: text("source").default("local"), // 'local', 'google', 'nextcloud'
	// etag: text("etag"),
});

export const categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	color: text("color").notNull(), // Hex code or tailwind class
	createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	isAllDay: boolean("is_all_day").default(false),
	location: text("location"),
	categoryId: integer("category_id").references(() => categories.id),
	reminders: jsonb("reminders"), // Array of reminder configurations

	// Sync fields
	syncId: text("sync_id"), // ID from external provider
	source: text("source").default("local"), // 'local', 'google', 'nextcloud'
	etag: text("etag"),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const todos = pgTable("todos", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	isDone: boolean("is_done").default(false),
	date: timestamp("date"), // Optional date for calendar
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
