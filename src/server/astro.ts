"use server";

import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { astronomicalHouses } from "@/db/schema";

export const getAstroHouses = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db
			.select()
			.from(astronomicalHouses)
			.orderBy(asc(astronomicalHouses.id)); // Order by ID to keep the sequence
	},
);
console.log("Astro data:", getAstroHouses());
