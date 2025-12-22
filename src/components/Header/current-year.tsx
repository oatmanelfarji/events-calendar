import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SeasonProgress } from "@/components/Header/season-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCurrentSeason, seasonConfig } from "@/lib/season-utils";

export function CurrentYear() {
	const { t } = useTranslation();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const now = new Date();
	const startOfYear = new Date(now.getFullYear(), 0, 1);
	const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

	const totalDuration = endOfYear.getTime() - startOfYear.getTime();
	const elapsed = now.getTime() - startOfYear.getTime();
	const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

	const daysPassed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
	const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24));
	const daysRemaining = totalDays - daysPassed;

	const currentSeason = getCurrentSeason();
	const config = currentSeason
		? seasonConfig[currentSeason.name]
		: {
				icon: CalendarClock,
				bgColor: "bg-orange-100 dark:bg-orange-900/30",
				iconColor: "text-white dark:text-white",
				progressColor: "bg-orange-600 dark:bg-orange-400",
			};

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
							<span
								className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
							>
								{now.getFullYear()}
							</span>
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
					<span className="font-semibold">{t("header.yearProgress")}</span>
					<span>
						{t("header.daysPassed", { count: daysPassed })} / {totalDays}
					</span>
					<span>{t("header.daysRemaining", { count: daysRemaining })}</span>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
