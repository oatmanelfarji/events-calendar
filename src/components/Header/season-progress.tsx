import { cn } from "@/lib/utils";

interface SeasonProgressProps {
	value: number;
	progressColor: string;
	bgColor: string;
	children: React.ReactNode;
}

export function SeasonProgress({
	value,
	progressColor,
	bgColor,
	children,
}: SeasonProgressProps) {
	const clampedValue = Math.min(Math.max(value, 0), 100);

	return (
		<div
			className={cn(
				"relative w-full h-8 rounded-full overflow-hidden border border-border/20",
				bgColor,
			)}
		>
			{/* Progress indicator */}
			<div
				className={cn(
					"absolute inset-0 h-full transition-all duration-300",
					progressColor,
				)}
				style={{ width: `${clampedValue}%` }}
			/>

			{/* Content overlay */}
			<div className="relative flex items-center px-3 h-full pointer-events-none z-10">
				{children}
			</div>
		</div>
	);
}
