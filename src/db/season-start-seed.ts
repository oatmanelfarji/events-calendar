import { config } from "dotenv";
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
		}));

		// Optional: Clear existing season start events?
		// For now, we will simply insert them.
		// If you want to avoid duplicates, you might want to delete based on criteria.
		// await db.delete(schema.events).where(...)

		// Insert events
		await db.insert(schema.events).values(formattedEvents);

		console.log(
			`✅ Successfully seeded ${formattedEvents.length} season start events!`,
		);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	} finally {
		await pool.end();
	}
}

seed();
