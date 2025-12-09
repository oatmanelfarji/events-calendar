import { Calendar, Globe, Info } from "lucide-react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Holiday {
	id: number;
	name: string;
	date: string;
	countryCode: string;
	type: string | null;
	description: string | null;
}

interface HolidaysListProps {
	holidays: Holiday[];
	isLoading?: boolean;
	title?: string;
	description?: string;
	emptyMessage?: string;
	showCountryCode?: boolean;
}

export function HolidaysList({
	holidays,
	isLoading = false,
	title,
	description,
	emptyMessage,
	showCountryCode = false,
}: HolidaysListProps) {
	const { t } = useTranslation();

	const defaultTitle = t("common.holidays");
	const defaultEmptyMessage = t("common.no_holidays_simple");

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						{title || defaultTitle}
					</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
					</div>
				</CardContent>
			</Card>
		);
	}

	// Filter and sort holidays
	const sortedHolidays = [...holidays].sort(
		(a, b) => moment(a.date).valueOf() - moment(b.date).valueOf(),
	);

	const today = moment().startOf("day");

	// Find index of the first holiday that is today or in the future
	const nextHolidayIndex = sortedHolidays.findIndex((h) => {
		return moment(h.date).isSameOrAfter(today);
	});

	let displayHolidays: Holiday[] = [];
	let nextHolidayId: number | null = null;

	if (nextHolidayIndex !== -1) {
		// Get 5 past holidays (if available)
		const start = Math.max(0, nextHolidayIndex - 5);
		const pastHolidays = sortedHolidays.slice(start, nextHolidayIndex);

		// Get 5 future holidays (including the next one)
		const futureHolidays = sortedHolidays.slice(
			nextHolidayIndex,
			nextHolidayIndex + 5,
		);

		displayHolidays = [...pastHolidays, ...futureHolidays];
		nextHolidayId = sortedHolidays[nextHolidayIndex].id;
	} else {
		// If no future holidays, just show the last 10
		displayHolidays = sortedHolidays.slice(-10);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					{title || defaultTitle}
				</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				{displayHolidays.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
						<Info className="h-12 w-12 mb-4 opacity-50" />
						<p>{emptyMessage || defaultEmptyMessage}</p>
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("common.date")}</TableHead>
									<TableHead>{t("common.name")}</TableHead>
									{showCountryCode && (
										<TableHead>{t("common.country")}</TableHead>
									)}
									<TableHead>{t("common.type")}</TableHead>
									<TableHead>{t("common.description")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{displayHolidays.map((holiday) => {
									const holidayDate = moment(holiday.date);
									const formattedDate = holidayDate.format("MMM DD, YYYY");
									const dayOfWeek = holidayDate.format("dddd");
									const isNext = holiday.id === nextHolidayId;

									return (
										<TableRow
											key={holiday.id}
											className={
												isNext
													? "bg-primary/10 hover:bg-primary/20 border-l-4 border-l-primary"
													: ""
											}
										>
											<TableCell>
												<div className="flex flex-col">
													<span className="font-medium">{formattedDate}</span>
													<span className="text-xs text-muted-foreground">
														{dayOfWeek}
													</span>
												</div>
											</TableCell>
											<TableCell className="font-medium">
												{holiday.name}
												{isNext && (
													<span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
														{t("common.next")}
													</span>
												)}
											</TableCell>
											{showCountryCode && (
												<TableCell>
													<div className="flex items-center gap-1">
														<Globe className="h-3 w-3" />
														<span className="text-xs font-mono">
															{holiday.countryCode}
														</span>
													</div>
												</TableCell>
											)}
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
														holiday.type === "public"
															? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
															: holiday.type === "religious"
																? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
																: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
													}`}
												>
													{holiday.type || "N/A"}
												</span>
											</TableCell>
											<TableCell className="max-w-md">
												<p className="text-sm text-muted-foreground line-clamp-2">
													{holiday.description || "—"}
												</p>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
