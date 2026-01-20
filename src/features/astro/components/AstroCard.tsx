import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AstroHouseProps {
	house: {
		id: number;
		season: string;
		commonName: string;
		englishName: string | null;
		startDate: string;
		starName: string;
		starDays: number;
		zodiacSign: string[] | null;
		zodiacDays: number[] | null;
		notes: string | null;
	};
	className?: string;
}

const seasonColors: Record<string, string> = {
	Winter:
		"bg-blue-100 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
	"Winter/Spring":
		"bg-teal-100 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800",
	Spring:
		"bg-green-100 dark:bg-green-950/30 border-green-200 dark:border-green-800",
	Summer:
		"bg-orange-100 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
	Autumn:
		"bg-amber-100 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
};

export function AstroCard({ house, className }: AstroHouseProps) {
	const seasonColor = seasonColors[house.season] || "bg-gray-100";

	return (
		<Card
			className={cn(
				"overflow-hidden transition-all hover:shadow-md",
				seasonColor,
				className,
			)}
		>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-xl font-bold">
							{house.commonName}
						</CardTitle>
						<div className="text-sm text-muted-foreground mt-1">
							{house.starName} • {house.season}
						</div>
					</div>
					<div className="text-right">
						<div className="font-semibold">{house.startDate}</div>
						<div className="text-xs text-muted-foreground">
							{house.starDays} days
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{house.englishName && (
					<p className="text-sm italic mb-2 text-muted-foreground">
						{house.englishName}
					</p>
				)}
				<div className="space-y-2 text-sm">
					{house.zodiacSign && (
						<div className="flex gap-2">
							<span className="font-semibold">Zodiac:</span>
							<span>
								{house.zodiacSign.map((sign, i) => (
									<span key={sign}>
										{sign} ({house.zodiacDays?.[i] ?? "?"} days)
										{i < (house.zodiacSign?.length ?? 0) - 1 ? ", " : ""}
									</span>
								))}
							</span>
						</div>
					)}
					{house.notes && (
						<div className="bg-white/50 dark:bg-black/20 p-2 rounded text-sm mt-3">
							{house.notes}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
