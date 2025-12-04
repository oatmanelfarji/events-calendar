import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { SeasonProgress } from "@/components/season-progress";

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

	const config = {
		icon: CalendarClock,
		iconColor: "text-slate-900 dark:text-slate-100",
		progressColor: "bg-slate-600 dark:bg-slate-400",
	};

	const Icon = config.icon;

	return (
		<div className="flex items-center gap-2">
			<SeasonProgress value={progress} progressColor={config.progressColor}>
				<div className="flex items-center justify-center gap-2 min-w-48">
					<Icon className={`h-5 w-5 ${config.iconColor} drop-shadow-md`} />
					<span
						className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
					>
						{now.getFullYear()}
						{" - "}
						{Math.round(progress)}%
					</span>
				</div>
			</SeasonProgress>
		</div>
	);
}
