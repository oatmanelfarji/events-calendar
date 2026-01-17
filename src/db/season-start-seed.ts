import { config } from "dotenv";
import { and, eq, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";
import { fileURLToPath } from "url";
import * as schema from "./schema.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
	try {
		console.log("🌱 Starting season start events seeding...");

		const seasonStartsPath = path.join(
			process.cwd(),
			"src",
			"data",
			"season-start.json",
		);
		console.log(`📖 Reading events from ${seasonStartsPath}...`);

		const rawData = fs.readFileSync(seasonStartsPath, "utf-8");
		const eventsData = JSON.parse(rawData);

		console.log(`📅 Found ${eventsData.length} events to seed.`);

		const formattedEvents = eventsData.map((event: any) => ({
			...event,
			startTime: new Date(event.startTime),
			endTime: new Date(event.endTime),
			userId: null, // Mark as global event
		}));

		// Clear existing season start events from local source to avoid duplicates
		console.log("🗑️ Clearing existing season start events...");
		await db
			.delete(schema.events)
			.where(
				and(
					eq(schema.events.source, "local"),
					or(
						ilike(schema.events.title, "%Spring Starts%"),
						ilike(schema.events.title, "%Summer Starts%"),
						ilike(schema.events.title, "%Autumn Starts%"),
						ilike(schema.events.title, "%Winter Starts%"),
					),
				),
			);

		// Insert events
		await db.insert(schema.events).values(formattedEvents);

		console.log(
			`✅ Successfully seeded ${formattedEvents.length} season start events as global!`,
		);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	} finally {
		await pool.end();
	}
}

seed();
