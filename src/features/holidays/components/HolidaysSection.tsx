import { Link } from "@tanstack/react-router";
import { ArrowRight, Palmtree } from "lucide-react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HolidaysSectionProps {
	holidays: { id: number; name: string; date: string }[];
	icon: React.ElementType;
	bgColor: string;
	textColor: string;
}

export function HolidaysSection({
	holidays,
	icon: Icon,
	textColor,
}: HolidaysSectionProps) {
	const { t } = useTranslation();
	const now = moment();
	const upcomingHolidays = holidays
		.filter((h) => moment(h.date).isSameOrAfter(now, "day"))
		.slice(0, 3);

	return (
		<Card className="group h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div
							className={cn(
								"p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
								"bg-linear-to-br from-background to-muted ring-1 ring-inset ring-foreground/5 shadow-sm",
							)}
						>
							<Icon className={cn("w-6 h-6", textColor)} />
						</div>
						<div className="space-y-1">
							<CardTitle className="text-xl font-display tracking-tight">
								{t("common.holidays", "Holidays")}
							</CardTitle>
							<CardDescription className="text-sm font-medium opacity-80">
								{t("common.upcoming_holidays", "Upcoming holidays")}
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col gap-6">
				{upcomingHolidays.length > 0 ? (
					<>
						<div className="space-y-3 flex-1">
							{upcomingHolidays.map((holiday) => (
								<div
									key={holiday.id}
									className="group/item relative flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-background/40 hover:bg-accent/30 hover:border-accent/50 transition-all duration-300 cursor-default"
								>
									<div className="mt-0.5 shrink-0">
										<div className="h-10 w-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary font-medium border border-primary/20 group-hover/item:border-primary/50 transition-colors">
											<span className="text-xs uppercase leading-none opacity-70">
												{moment(holiday.date).format("MMM")}
											</span>
											<span className="text-lg leading-none font-bold">
												{moment(holiday.date).format("D")}
											</span>
										</div>
									</div>
									<div className="min-w-0 flex-1 space-y-1 py-1.5">
										<p className="font-medium text-sm leading-tight truncate group-hover/item:text-primary transition-colors">
											{holiday.name}
										</p>
										<div className="flex items-center gap-2 text-xs text-muted-foreground opacity-80">
											<span className="truncate">
												{moment(holiday.date).fromNow()}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="grid grid-cols-1 gap-3 mt-auto pt-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Link to="/holidays" className="w-full">
										<Button
											variant="secondary"
											className="w-full hover:bg-accent hover:text-accent-foreground transition-colors border border-border/50"
										>
											{t("common.view_all", "View All")}
											<ArrowRight className="w-4 h-4 ml-2 opacity-60" />
										</Button>
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									{t("common.view_all", "View All")}
								</TooltipContent>
							</Tooltip>
						</div>
					</>
				) : (
					<div className="flex-1 flex flex-col">
						<div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-4">
							<div className="p-4 rounded-full bg-muted/50 ring-1 ring-border/50">
								<Palmtree className="w-8 h-8 text-muted-foreground/60" />
							</div>
							<div className="space-y-1 max-w-[200px]">
								<p className="font-medium">
									{t("common.no_holidays", "No upcoming holidays")}
								</p>
								<p className="text-sm text-muted-foreground">
									{t(
										"common.no_holidays_desc",
										"Check back later for more holidays.",
									)}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-3 pt-4">
							<Tooltip>
								<TooltipTrigger asChild>
									<Link to="/holidays" className="w-full">
										<Button
											variant="ghost"
											className="w-full group/btn hover:bg-accent/50"
										>
											{t("common.view_calendar", "View Calendar")}
											<ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
										</Button>
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									{t("common.view_calendar", "View Calendar")}
								</TooltipContent>
							</Tooltip>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
