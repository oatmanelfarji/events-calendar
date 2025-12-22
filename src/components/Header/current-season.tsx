import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SeasonProgress } from "@/components/Header/season-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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

function calculateDaysRemaining(season: Season): number {
	const now = new Date();
	const end = new Date(season.endDate);
	const remaining = end.getTime() - now.getTime();
	return Math.max(Math.ceil(remaining / (1000 * 60 * 60 * 24)), 0);
}

export function CurrentSeason() {
	const { t } = useTranslation();
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
	const daysRemaining = calculateDaysRemaining(currentSeason);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="flex items-center gap-2 hover:scale-110 transition-all duration-300 cursor-pointer">
					<SeasonProgress
						value={progress}
						progressColor={config.progressColor}
						bgColor={config.bgColor}
					>
						<div className="flex items-center justify-between gap-2 min-w-48">
							<div className="flex items-center gap-2">
								<Icon
									className={`h-5 w-5 ${config.iconColor} drop-shadow-md`}
								/>
								<span
									className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
								>
									{t(`seasons.${currentSeason.name}`)}
								</span>
							</div>
							<span
								className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
							>
								{Math.round(progress)}%
							</span>
						</div>
					</SeasonProgress>
				</div>
			</TooltipTrigger>
			<TooltipContent side="bottom" sideOffset={8}>
				<div className="flex flex-col gap-1">
					<span className="font-semibold">
						{t(`seasons.${currentSeason.name}`)} {t("header.seasonProgress")}
					</span>
					<span>
						{t("header.startDate")}: {currentSeason.startDate}
					</span>
					<span>
						{t("header.endDate")}: {currentSeason.endDate}
					</span>
					<span>{t("header.daysRemaining", { count: daysRemaining })}</span>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
