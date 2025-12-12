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
		iconColor: "text-green-900 dark:text-green-900",
		progressColor: "bg-green-600 dark:bg-green-500",
	},
	summer: {
		icon: Sun,
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		iconColor: "text-yellow-900 dark:text-yellow-900",
		progressColor: "bg-yellow-400 dark:bg-yellow-400",
	},
	autumn: {
		icon: Leaf,
		bgColor: "bg-orange-100 dark:bg-orange-900/30",
		iconColor: "text-orange-950 dark:text-orange-900",
		progressColor: "bg-orange-600 dark:bg-orange-700",
	},
	winter: {
		icon: Snowflake,
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
		iconColor: "text-blue-900 dark:text-blue-900",
		progressColor: "bg-blue-600 dark:bg-blue-500",
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
