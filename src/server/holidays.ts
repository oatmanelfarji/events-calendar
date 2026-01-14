"use server";

import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, gte, lte } from "drizzle-orm";
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
	.inputValidator(
		z.object({
			year: z.number(),
			countryCode: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const { year, countryCode } = data;

		// Only log in development
		if (process.env.NODE_ENV === "development") {
			console.log(`Fetching holidays for ${countryCode} in ${year}...`);
		}

		try {
			const response = await fetch(
				`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch holidays: ${response.statusText}`);
			}

			const rawData = await response.json();
			const publicHolidays = z.array(PublicHolidaySchema).parse(rawData);

			const values = publicHolidays.map((h) => ({
				name: h.name,
				date: h.date,
				countryCode: h.countryCode,
				type: h.types[0] || "public",
				description: h.localName,
			}));

			if (values.length > 0) {
				await db.insert(holidays).values(values).onConflictDoNothing();
			}

			return { success: true, count: values.length };
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("Error seeding holidays:", error);
			}
			throw error;
		}
	});

export const getHolidays = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			year: z.number().optional(),
			countryCode: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const { year, countryCode } = data;

		const conditions = [eq(holidays.countryCode, countryCode)];

		if (year) {
			const startOfYear = `${year}-01-01`;
			const endOfYear = `${year}-12-31`;
			conditions.push(
				gte(holidays.date, startOfYear),
				lte(holidays.date, endOfYear),
			);
		}

		// Use SQL ordering instead of JavaScript sort
		return await db
			.select()
			.from(holidays)
			.where(and(...conditions))
			.orderBy(asc(holidays.date));
	});

export const getNextHoliday = createServerFn({ method: "GET" })
	.inputValidator(z.object({ countryCode: z.string() }))
	.handler(async ({ data }) => {
		const { countryCode } = data;
		const now = new Date();
		const currentDate = now.toISOString().split("T")[0];

		// Use SQL ordering and LIMIT instead of fetching all and sorting in JS
		const results = await db
			.select()
			.from(holidays)
			.where(
				and(
					eq(holidays.countryCode, countryCode),
					gte(holidays.date, currentDate),
				),
			)
			.orderBy(asc(holidays.date))
			.limit(1);

		return results[0] || null;
	});
