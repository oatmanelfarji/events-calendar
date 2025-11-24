import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.ts";

config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const moroccanHolidays = [
	{
		name: "New Year's Day",
		date: "2025-01-01",
		countryCode: "MA",
		type: "public",
		description: "The first day of the year. (رأس السنة الميلادية - Rās lʿām)",
	},
	{
		name: "Independence Manifesto Day",
		date: "2025-01-11",
		countryCode: "MA",
		type: "public",
		description:
			"Commemoration of the presentation of the independence manifesto. (تقديم وثيقة الاستقلال - Taqdīm watīqat lʾistiqlāl)",
	},
	{
		name: "Amazigh New Year",
		date: "2025-01-14",
		countryCode: "MA",
		type: "public",
		description: "Amazigh New Year celebration. (ينّاير - Yennayer)",
	},
	{
		name: "Labour Day",
		date: "2025-05-01",
		countryCode: "MA",
		type: "public",
		description: "International Workers' Day. (عيد الشغل - ʿīd ššuġl)",
	},
	{
		name: "Islamic New Year",
		date: "2025-06-26",
		countryCode: "MA",
		type: "religious",
		description:
			"First day on the Islamic calendar. (فاتح محرم - Fātiḥ muḥarram)",
	},
	{
		name: "Throne Day",
		date: "2025-07-30",
		countryCode: "MA",
		type: "public",
		description:
			"Celebration of King Mohammed VI's accession to the throne. (عيد العرش - ʿīd lʿarš)",
	},
	{
		name: "Oued Ed-Dahab Day",
		date: "2025-08-14",
		countryCode: "MA",
		type: "public",
		description:
			"Recovery of the Oued Ed-Dahab region. (استرجاع إقليم وادي الذهب - Ḏikrat wād ddahab)",
	},
	{
		name: "Revolution Day",
		date: "2025-08-20",
		countryCode: "MA",
		type: "public",
		description:
			"Revolution of the King and the People. (ثورة الملك والشعب - Ṯawrat lmalik wa ššaʿb)",
	},
	{
		name: "Youth Day",
		date: "2025-08-21",
		countryCode: "MA",
		type: "public",
		description:
			"Celebration of youth and King Mohammed VI's birthday. (عيد الشباب - ʿīd ššabāb)",
	},
	{
		name: "The Prophet's Birthday",
		date: "2025-09-05",
		countryCode: "MA",
		type: "religious",
		description:
			"The Birthday of the Prophet of Islam Mohammed (PBUH). (عيد المولد النبوي - ʿid lmawlid)",
	},
	{
		name: "Green March Day",
		date: "2025-11-06",
		countryCode: "MA",
		type: "public",
		description:
			"Commemoration of the Green March. (ذكرى المسيرة الخضراء - ʿīd lmasīra lẖadraʾ)",
	},
	{
		name: "Independence Day",
		date: "2025-11-18",
		countryCode: "MA",
		type: "public",
		description:
			"Morocco's independence from France and Spain. (عيد الاستقلال - ʿid lʾistiqlal)",
	},
];

async function seed() {
	try {
		console.log("🌱 Starting database seeding...");

		// Clear existing Moroccan holidays
		console.log("🗑️  Clearing existing Moroccan holidays...");
		await db
			.delete(schema.holidays)
			.where(eq(schema.holidays.countryCode, "MA"));

		// Insert Moroccan holidays
		console.log("📅 Inserting Moroccan holidays...");
		await db.insert(schema.holidays).values(moroccanHolidays);

		console.log(
			`✅ Successfully seeded ${moroccanHolidays.length} Moroccan holidays!`,
		);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	} finally {
		await pool.end();
	}
}

seed();
