import { Calendar, Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SeasonProgress } from "@/components/season-progress";
import seasonsData from "@/data/seasons.json";

type Season = {
	name: "spring" | "summer" | "autumn" | "winter";
	startDate: string;
	endDate: string;
};

type SeasonsData = {
	[year: string]: Season[];
};

const seasonConfig = {
	spring: {
		icon: Flower2,
		bgColor: "bg-green-100 dark:bg-green-900/30",
		iconColor: "text-green-900 dark:text-green-900",
		progressColor: "bg-green-600 dark:bg-green-400",
	},
	summer: {
		icon: Sun,
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		iconColor: "text-yellow-900 dark:text-yellow-900",
		progressColor: "bg-yellow-600 dark:bg-yellow-400",
	},
	autumn: {
		icon: Leaf,
		bgColor: "bg-orange-100 dark:bg-orange-900/30",
		iconColor: "text-orange-950 dark:text-orange-900",
		progressColor: "bg-orange-600 dark:bg-orange-400",
	},
	winter: {
		icon: Snowflake,
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
		iconColor: "text-blue-900 dark:text-blue-900",
		progressColor: "bg-blue-600 dark:bg-blue-400",
	},
} as const;

function getCurrentSeason(): Season | null {
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

function calculateSeasonProgress(season: Season): number {
	const now = new Date();
	const start = new Date(season.startDate);
	const end = new Date(season.endDate);

	const totalDuration = end.getTime() - start.getTime();
	const elapsed = now.getTime() - start.getTime();

	const progress = (elapsed / totalDuration) * 100;
	return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
}

export function CurrentSeason() {
	const { t, i18n } = useTranslation();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const currentSeason = getCurrentSeason();

	if (!currentSeason) return null;

	const config = seasonConfig[currentSeason.name];
	const Icon = config.icon;
	const progress = calculateSeasonProgress(currentSeason);

	// Format the current date based on the current locale
	const now = new Date();
	const formattedDate = new Intl.DateTimeFormat(i18n.language, {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(now);

	return (
		<div className="flex items-center gap-2">
			{/* Season Progress Bar with Badge Inside */}
			<SeasonProgress value={progress} progressColor={config.progressColor}>
				<div className="flex items-center justify-center gap-2 min-w-48">
					{/* current Season start Date */}
					{/* <span className="text-xs font-semibold text-foreground min-w-12 text-right">
						{currentSeason.startDate}
					</span>

					<span className="text-xs font-bold text-foreground px-1"> | </span> */}

					{/* current Season icon */}
					<Icon className={`h-5 w-5 ${config.iconColor} drop-shadow-md`} />

					{/* current Season name */}
					<span
						className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
					>
						{t(`seasons.${currentSeason.name}`)}
						{" - "}
						{Math.round(progress)}%
					</span>

					{/* <span className="text-xs font-bold text-foreground px-1"> | </span> */}

					{/* current Season end Date */}
					{/* <span className="text-xs font-semibold text-foreground min-w-12 text-right">
						{currentSeason.endDate}
					</span> */}
				</div>
			</SeasonProgress>
			{/* current date
			<div className="flex items-center gap-2">
				<Calendar className="h-5 w-5 text-foreground drop-shadow-md" />
				<span className="text-xs font-semibold text-foreground min-w-48 drop-shadow-md">
					{formattedDate}
				</span>
			</div> */}
		</div>
	);
}
