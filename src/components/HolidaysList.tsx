import { format } from "date-fns";
import { Calendar, Globe, Info } from "lucide-react";
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
	title = "Holidays",
	description,
	emptyMessage = "No holidays found.",
	showCountryCode = false,
}: HolidaysListProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						{title}
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

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					{title}
				</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				{holidays.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
						<Info className="h-12 w-12 mb-4 opacity-50" />
						<p>{emptyMessage}</p>
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Name</TableHead>
									{showCountryCode && <TableHead>Country</TableHead>}
									<TableHead>Type</TableHead>
									<TableHead>Description</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{holidays.map((holiday) => {
									const holidayDate = new Date(holiday.date);
									const formattedDate = format(holidayDate, "MMM dd, yyyy");
									const dayOfWeek = format(holidayDate, "EEEE");

									return (
										<TableRow key={holiday.id}>
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
