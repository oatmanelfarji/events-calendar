import {
	boolean,
	date,
	index,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const holidays = pgTable(
	"holidays",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		localName: text("local_name").$default(() => ""),
		date: date("date").notNull(),
		countryCode: text("country_code").notNull(),
		type: text("type"), // e.g., 'public', 'religious'
		description: text("description"),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => [
		index("holidays_country_date_idx").on(table.countryCode, table.date),
	],
);

export const categoryEnum = pgEnum("category", [
	"national",
	"religious",
	"family",
	"personal",
	"other",
]);

export const events = pgTable(
	"events",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		startTime: timestamp("start_time").notNull(),
		endTime: timestamp("end_time").notNull(),
		isAllDay: boolean("is_all_day").default(false),
		location: text("location"),
		category: categoryEnum("category").default("personal"),
		reminders: jsonb("reminders"), // Array of reminder configurations

		// User association
		userId: text("user_id").references(() => user.id),

		// Sync fields
		syncId: text("sync_id"), // ID from external provider
		source: text("source").default("local"), // 'local', 'google', 'nextcloud'
		etag: text("etag"),

		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [
		index("events_start_time_idx").on(table.startTime),
		index("events_user_id_idx").on(table.userId),
	],
);

export const todos = pgTable(
	"todos",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		isDone: boolean("is_done").default(false),
		date: timestamp("date"), // Optional date for calendar

		// User association
		userId: text("user_id").references(() => user.id),

		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [
		index("todos_date_idx").on(table.date),
		index("todos_user_id_idx").on(table.userId),
	],
);

export const seasons = pgTable("seasons", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(), // spring, summer, autumn, winter
	startDate: date("start_date").notNull(), // stored as month-day, can be used across years
	endDate: date("end_date").notNull(), // stored as month-day, can be used across years
	year: text("year").notNull(), // store which year this entry is for
	createdAt: timestamp("created_at").defaultNow(),
});

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});
