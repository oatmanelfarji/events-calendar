import { Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import seasonsData from "@/data/seasons.json";

export type Season = {
	name: "spring" | "summer" | "autumn" | "winter";
	startDate: string;
	endDate: string;
};

type SeasonsData = {
	[year: string]: Season[];
};

export const seasonConfig = {
	spring: {
		icon: Flower2,
		bgColor: "bg-green-100 dark:bg-green-900/30",
		iconColor: "text-stone-950 dark:text-white",
		progressColor: "bg-[var(--season-spring)]",
	},
	summer: {
		icon: Sun,
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		iconColor: "text-stone-950 dark:text-white",
		progressColor: "bg-[var(--season-summer)]",
	},
	autumn: {
		icon: Leaf,
		bgColor: "bg-orange-100 dark:bg-orange-900/30",
		iconColor: "text-stone-950 dark:text-white",
		progressColor: "bg-[var(--season-autumn)]",
	},
	winter: {
		icon: Snowflake,
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
		iconColor: "text-stone-950 dark:text-white",
		progressColor: "bg-[var(--season-winter)]",
	},
} as const;

export function getCurrentSeason(): Season | null {
	const now = new Date();
	const year = now.getFullYear();
	const currentDate = now.toISOString().split("T")[0];

	const seasons = (seasonsData as SeasonsData)[year.toString()];
	if (!seasons) return null;

	for (const season of seasons) {
		if (currentDate >= season.startDate && currentDate <= season.endDate) {
			return season;
		}
	}

	return null;
}
