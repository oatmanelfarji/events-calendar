import { cn } from "@/lib/utils";

interface SeasonProgressProps {
	value: number;
	progressColor: string;
	children: React.ReactNode;
}

export function SeasonProgress({
	value,
	progressColor,
	children,
}: SeasonProgressProps) {
	const clampedValue = Math.min(Math.max(value, 0), 100);

	return (
		<div
			className={`relative w-full h-8 rounded-full overflow-hidden bg-foreground/50 border border-blue-950 dark:border-white`}
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
