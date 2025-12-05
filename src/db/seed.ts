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

interface HolidayDef {
	date: string; // "Month Day"
	name: string;
	description: string;
	arabic: string;
}

function parseHolidaysFromMarkdown(): HolidayDef[] {
	const filePath = path.join(process.cwd(), "notes", "MoroccanHolidays.md");
	const content = fs.readFileSync(filePath, "utf-8");
	const holidays: HolidayDef[] = [];

	// Regex to match each holiday object in the markdown
	// Looking for patterns like:
	// {
	//     date: 'January 1',
	//     name: 'New Year\'s Day',
	//     ...
	// }
	const blockRegex = /\{([\s\S]*?)\}/g;
	let match: RegExpExecArray | null = blockRegex.exec(content);

	while (match !== null) {
		const block = match[1];
		const dateMatch = block.match(/date:\s*'([^']+)'/);
		const nameMatch = block.match(/name:\s*'([^']+)'/);
		const descMatch = block.match(/description:\s*'([^']+)'/);
		const arabicMatch = block.match(/arabic:\s*'([^']+)'/);

		if (dateMatch && nameMatch) {
			holidays.push({
				date: dateMatch[1],
				name: nameMatch[1],
				description: descMatch ? descMatch[1] : "",
				arabic: arabicMatch ? arabicMatch[1] : "",
			});
		}
		match = blockRegex.exec(content);
	}

	return holidays;
}

function getHolidayDate(year: number, dateStr: string): string {
	const date = new Date(`${dateStr}, ${year}`);
	// Format as YYYY-MM-DD
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

async function seed() {
	try {
		console.log("🌱 Starting database seeding...");

		// Clear existing Moroccan holidays
		console.log("🗑️  Clearing existing Moroccan holidays...");
		await db
			.delete(schema.holidays)
			.where(eq(schema.holidays.countryCode, "MA"));

		const holidayDefs = parseHolidaysFromMarkdown();
		console.log(`📖 Parsed ${holidayDefs.length} holiday definitions.`);

		const allHolidays = [];
		const startYear = 2026;
		const endYear = 2035;

		for (let year = startYear; year <= endYear; year++) {
			for (const def of holidayDefs) {
				allHolidays.push({
					name: def.name,
					date: getHolidayDate(year, def.date),
					countryCode: "MA",
					type: "public",
					description: `${def.description} (${def.arabic})`,
				});
			}
		}

		// Insert Moroccan holidays
		console.log(
			`📅 Inserting Moroccan holidays for ${startYear}-${endYear}...`,
		);

		// Insert in batches to avoid query size limits if necessary, though ~100 items is fine
		await db.insert(schema.holidays).values(allHolidays);

		console.log(
			`✅ Successfully seeded ${allHolidays.length} Moroccan holidays!`,
		);

		// Seed seasons
		console.log("🌱 Seeding seasons...");
		const seasonsFilePath = path.join(
			process.cwd(),
			"src",
			"data",
			"seasons.json",
		);
		const seasonsData = JSON.parse(
			fs.readFileSync(seasonsFilePath, "utf-8"),
		) as Record<
			string,
			Array<{ name: string; startDate: string; endDate: string }>
		>;

		// Clear existing seasons
		await db.delete(schema.seasons);

		const allSeasons = [];
		for (const [year, seasons] of Object.entries(seasonsData)) {
			for (const season of seasons) {
				allSeasons.push({
					name: season.name,
					startDate: season.startDate,
					endDate: season.endDate,
					year: year,
				});
			}
		}

		await db.insert(schema.seasons).values(allSeasons);
		console.log(`✅ Successfully seeded ${allSeasons.length} seasons!`);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	} finally {
		await pool.end();
	}
}

seed();
