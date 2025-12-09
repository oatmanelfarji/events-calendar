import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
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
	bgColor,
	textColor,
}: HolidaysSectionProps) {
	const { t } = useTranslation();
	const now = moment();
	const upcomingHolidays = holidays
		.filter((h) => moment(h.date).isSameOrAfter(now, "day"))
		.slice(0, 3);

	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className={cn("p-3 rounded-lg", bgColor)}>
							<Icon className={cn("w-6 h-6", textColor)} />
						</div>
						<div>
							<CardTitle>{t("common.holidays", "Holidays")}</CardTitle>
							<CardDescription>
								{t("common.upcoming_holidays", "Upcoming holidays")}
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{upcomingHolidays.length > 0 ? (
					<>
						<div className="space-y-3">
							{upcomingHolidays.map((holiday) => (
								<div
									key={holiday.id}
									className="p-3 rounded-lg border hover:bg-accent transition-colors"
								>
									<div className="font-medium truncate">{holiday.name}</div>
									<div className="text-sm text-muted-foreground">
										{moment(holiday.date).format("MMMM Do, YYYY")}
									</div>
								</div>
							))}
						</div>
						<Link to="/holidays">
							<Button variant="outline" className="w-full group">
								{t("common.view_all", "View All")}
								<ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
					</>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						{t("common.no_holidays", "No upcoming holidays")}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
