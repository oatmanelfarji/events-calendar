import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./index";
import { astronomicalHouses } from "./schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.resolve(__dirname, "../data/astro.json");
const rawData = fs.readFileSync(dataPath, "utf-8");
const astroData = JSON.parse(rawData);

async function seed() {
	console.log("Seeding astronomical houses...");

	for (const house of astroData) {
		await db.insert(astronomicalHouses).values({
			season: house.season,
			commonName: house.common_name,
			englishName: house.english_name || null,
			startDate: house.start_date,
			starName: house.star_name,
			starDays: house.star_days,
			zodiacSign: house.zodiac_sign,
			zodiacDays: house.zodiac_days,
			notes: house.notes,
		});
	}

	console.log("Seeding complete!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seeding failed:", err);
	process.exit(1);
});
