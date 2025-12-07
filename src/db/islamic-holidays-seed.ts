import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";
import * as schema from "./schema.ts";

config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

interface IslamicHoliday {
	name: string;
	localName: string;
	date: string;
	countryCode: string;
	type: string;
	description: string;
	hijriDate: string;
}

async function seed() {
	try {
		console.log("🌱 Starting Islamic holidays database seeding...");

		// Read the JSON file
		const filePath = path.join(
			process.cwd(),
			"src",
			"data",
			"islamic-holidays.json",
		);
		const holidays: IslamicHoliday[] = JSON.parse(
			fs.readFileSync(filePath, "utf-8"),
		);

		console.log(`📖 Loaded ${holidays.length} Islamic holidays.`);

		// Clear existing Islamic holidays (type = 'religious' and countryCode = 'MA')
		// Since Islamic holidays are marked as 'religious' type
		console.log("🗑️  Clearing existing Islamic holidays...");
		await db
			.delete(schema.holidays)
			.where(eq(schema.holidays.type, "religious"));

		// Prepare data for insertion (excluding localName as it's not in current DB schema)
		const holidaysToInsert = holidays.map((holiday) => ({
			name: holiday.name,
			date: holiday.date,
			countryCode: holiday.countryCode,
			type: holiday.type,
			description: holiday.description,
		}));

		// Insert Islamic holidays
		console.log(`📅 Inserting ${holidaysToInsert.length} Islamic holidays...`);
		await db.insert(schema.holidays).values(holidaysToInsert);

		console.log(
			`✅ Successfully seeded ${holidaysToInsert.length} Islamic holidays!`,
		);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	} finally {
		await pool.end();
	}
}

seed();
