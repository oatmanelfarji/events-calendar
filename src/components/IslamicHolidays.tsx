import moment from "moment-hijri";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface IslamicHoliday {
	name: string;
	hijriDate: string; // e.g., "1445-01-01"
	gregorianDate: moment.Moment;
}

export function IslamicHolidays() {
	const currentHijriYear = parseInt(moment().format("iYYYY"), 10);

	// Define holidays with their Hijri month and day
	const holidaysDef = [
		{ name: "Islamic New Year", month: 1, day: 1 },
		{ name: "Ashura", month: 1, day: 10 },
		{ name: "Prophet's Birthday", month: 3, day: 12 },
		{ name: "Isra and Mi'raj", month: 7, day: 27 },
		{ name: "Mid-Sha'ban", month: 8, day: 15 },
		{ name: "Start of Ramadan", month: 9, day: 1 },
		{ name: "Eid al-Fitr", month: 10, day: 1 },
		{ name: "Arafat Day", month: 12, day: 9 },
		{ name: "Eid al-Adha", month: 12, day: 10 },
	];

	const getHolidaysForYear = (year: number): IslamicHoliday[] => {
		return holidaysDef.map((def) => {
			const hijriDateStr = `${year}-${def.month}-${def.day}`;
			// moment-hijri parses "iYYYY-iM-iD" format
			const m = moment(hijriDateStr, "iYYYY-iM-iD");
			return {
				name: def.name,
				hijriDate: m.format("iD iMMMM iYYYY"),
				gregorianDate: m,
			};
		});
	};

	// Get holidays for current and next Hijri year to ensure we show upcoming ones
	const currentYearHolidays = getHolidaysForYear(currentHijriYear);
	const nextYearHolidays = getHolidaysForYear(currentHijriYear + 1);
	const allHolidays = [...currentYearHolidays, ...nextYearHolidays];

	// Filter and sort to show relevant holidays (e.g., recent past and upcoming)
	const now = moment();
	// Sort by date
	allHolidays.sort((a, b) => a.gregorianDate.diff(b.gregorianDate));

	// Let's show holidays from 1 month ago to 11 months in the future to keep the list manageable
	// Or just show the current hijri year's holidays?
	// The user asked for "time past since the last holiday & how much time till the next holiday"
	// So listing them all is good, but highlighting the next/last is important.

	// Let's just list the current Hijri year's holidays for now, or maybe a window around today.
	// Let's stick to the current Hijri year + next upcoming ones if we are at the end of the year.

	// Actually, let's just show the list of these major holidays sorted by date,
	// and for each, show the relative time.

	// We want to show the *nearest* instance of each holiday?
	// Or just the holidays in the current Hijri year?
	// If today is 1445-12-20, Eid al-Adha (12-10) has passed.
	// The user might want to know how long ago it was.
	// And when the *next* Islamic New Year is.

	// Let's display the holidays for the current Hijri Year.
	const displayHolidays = currentYearHolidays;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Islamic Holidays ({currentHijriYear} AH)</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Holiday</TableHead>
							<TableHead>Hijri Date</TableHead>
							<TableHead>Gregorian Date</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{displayHolidays.map((holiday) => {
							const diffDays = holiday.gregorianDate.diff(now, "days");
							const relativeTime = holiday.gregorianDate.fromNow();
							const isPast = diffDays < 0;
							const isToday = diffDays === 0;

							return (
								<TableRow key={holiday.name}>
									<TableCell className="font-medium">{holiday.name}</TableCell>
									<TableCell>{holiday.hijriDate}</TableCell>
									<TableCell>{holiday.gregorianDate.format("LL")}</TableCell>
									<TableCell>
										<Badge
											variant={
												isToday ? "default" : isPast ? "secondary" : "outline"
											}
										>
											{relativeTime}
										</Badge>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
