import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SeasonProgress } from "@/components/Header/season-progress";
import {
	getCurrentSeason,
	type Season,
	seasonConfig,
} from "@/lib/season-utils";

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
						{" -> "}
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
