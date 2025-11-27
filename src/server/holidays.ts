import { createServerFn } from "@tanstack/react-start";
import { and, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { holidays } from "@/db/schema";

// Types for Nager.Date API response
const PublicHolidaySchema = z.object({
	date: z.string(),
	localName: z.string(),
	name: z.string(),
	countryCode: z.string(),
	fixed: z.boolean(),
	global: z.boolean(),
	counties: z.array(z.string()).nullable(),
	launchYear: z.number().nullable(),
	types: z.array(z.string()),
});

export const fetchAndSeedHolidays = createServerFn({ method: "POST" })
	.inputValidator((data: { year: number; countryCode: string }) => data)
	.handler(async ({ data }) => {
		const { year, countryCode } = data;
		console.log(`Fetching holidays for ${countryCode} in ${year}...`);

		try {
			const response = await fetch(
				`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch holidays: ${response.statusText}`);
			}

			const rawData = await response.json();
			const publicHolidays = z.array(PublicHolidaySchema).parse(rawData);

			// Insert into DB
			// We'll use a transaction or just simple inserts for now.
			// Ideally we should check for duplicates or use ON CONFLICT DO NOTHING

			const values = publicHolidays.map((h) => ({
				name: h.name,
				date: h.date, // String 'YYYY-MM-DD' works for Drizzle date type
				countryCode: h.countryCode,
				type: h.types[0] || "public",
				description: h.localName,
			}));

			if (values.length > 0) {
				await db.insert(holidays).values(values).onConflictDoNothing();
			}

			return { success: true, count: values.length };
		} catch (error) {
			console.error("Error seeding holidays:", error);
			throw error;
		}
	});

export const getHolidays = createServerFn({ method: "GET" })
	.inputValidator((data: { year: number; countryCode: string }) => data)
	.handler(async ({ data }) => {
		const { year, countryCode } = data;

		const startOfYear = `${year}-01-01`;
		const endOfYear = `${year}-12-31`;

		const results = await db
			.select()
			.from(holidays)
			.where(
				and(
					eq(holidays.countryCode, countryCode),
					gte(holidays.date, startOfYear),
					lte(holidays.date, endOfYear),
				),
			);

		return results;
	});
