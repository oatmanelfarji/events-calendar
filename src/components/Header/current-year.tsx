import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { SeasonProgress } from "@/components/Header/season-progress";
import { getCurrentSeason, seasonConfig } from "@/lib/season-utils";

export function CurrentYear() {
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

	const currentSeason = getCurrentSeason();
	const config = currentSeason
		? seasonConfig[currentSeason.name]
		: {
				icon: CalendarClock,
				bgColor: "bg-orange-100 dark:bg-orange-900/30",
				iconColor: "text-foreground dark:text-foreground",
				progressColor: "bg-orange-600 dark:bg-orange-400",
			};

	return (
		<div className="flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300">
			<SeasonProgress
				value={progress}
				progressColor={config.progressColor}
				bgColor={config.bgColor}
			>
				<div className="flex items-center justify-center gap-2 min-w-48">
					<span
						className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
					>
						{now.getFullYear()}
						{" -> "}
						{Math.round(progress)}%
					</span>
				</div>
			</SeasonProgress>
		</div>
	);
}
