import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Plus,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "../../lib/date-locale";
import { cn } from "../../lib/utils";
import {
	createEvent,
	deleteEvent,
	getEvents,
	updateEvent,
} from "../../server/events";
import { getHolidays } from "../../server/holidays";
import { EventForm } from "../Events/EventForm";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function CalendarView() {
	const { t } = useTranslation();
	const locale = getDateFnsLocale();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<any>(null);
	const queryClient = useQueryClient();

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart, { locale });
	const endDate = endOfWeek(monthEnd, { locale });

	const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

	// Fetch Events
	const { data: events } = useQuery({
		queryKey: ["events", startDate.toISOString(), endDate.toISOString()],
		queryFn: () =>
			getEvents({
				data: {
					start: startDate.toISOString(),
					end: endDate.toISOString(),
				},
			}),
	});

	// Fetch Holidays (Morocco by default, should come from settings context)
	const { data: holidays } = useQuery({
		queryKey: ["holidays", currentDate.getFullYear(), "MA"],
		queryFn: () =>
			getHolidays({
				data: { year: currentDate.getFullYear(), countryCode: "MA" },
			}),
	});

	const createMutation = useMutation({
		mutationFn: (data: any) => createEvent({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			setIsEventModalOpen(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: any) => updateEvent({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			setIsEventModalOpen(false);
		},
	});

	const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
	const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

	const handleDayClick = (day: Date) => {
		setSelectedDate(day);
		setEditingEvent(null);
		setIsEventModalOpen(true);
	};

	const handleEventClick = (e: React.MouseEvent, event: any) => {
		e.stopPropagation();
		setEditingEvent(event);
		setIsEventModalOpen(true);
	};

	const handleFormSubmit = (data: any) => {
		if (editingEvent) {
			updateMutation.mutate({ ...data, id: editingEvent.id });
		} else {
			createMutation.mutate(data);
		}
	};

	// Generate weekday headers based on locale
	const weekDays = eachDayOfInterval({
		start: startOfWeek(new Date(), { locale }),
		end: endOfWeek(new Date(), { locale }),
	}).map((day) => format(day, "EEE", { locale }));

	return (
		<div className="h-full flex flex-col bg-background text-foreground">
			{/* Header */}
			<div className="flex items-center justify-between p-6 bg-card/50 backdrop-blur-md border-b border-border">
				<div className="flex items-center gap-4">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						{format(currentDate, "MMMM yyyy", { locale })}
					</h2>
					<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={handlePrevMonth}
							className="hover:bg-accent"
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setCurrentDate(new Date())}
							className="hover:bg-accent text-sm font-medium px-3"
						>
							{t("common.today")}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNextMonth}
							className="hover:bg-accent"
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
					</div>
				</div>
				<Button
					onClick={() => {
						setSelectedDate(new Date());
						setEditingEvent(null);
						setIsEventModalOpen(true);
					}}
				>
					<Plus className="w-4 h-4 mr-2" /> {t("common.new_event")}
				</Button>
			</div>

			{/* Calendar Grid */}
			<div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] gap-px bg-border overflow-hidden">
				{/* Weekday Headers */}
				{weekDays.map((day) => (
					<div
						key={day}
						className="bg-muted/80 p-3 text-center text-sm font-medium text-muted-foreground border-b border-border"
					>
						{day}
					</div>
				))}

				{/* Days */}
				{calendarDays.map((day, dayIdx) => {
					const dayEvents = events?.filter((e) =>
						isSameDay(new Date(e.startTime), day),
					);
					const dayHolidays = holidays?.filter((h) =>
						isSameDay(new Date(h.date), day),
					);

					return (
						<div
							key={day.toString()}
							onClick={() => handleDayClick(day)}
							className={cn(
								"bg-card p-2 min-h-[100px] transition-colors hover:bg-accent/50 cursor-pointer flex flex-col gap-1",
								!isSameMonth(day, currentDate) &&
									"bg-muted/30 text-muted-foreground",
								isToday(day) && "bg-accent/80",
							)}
						>
							<div className="flex justify-between items-start">
								<span
									className={cn(
										"text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
										isToday(day)
											? "bg-primary text-primary-foreground shadow-lg"
											: "text-muted-foreground",
									)}
								>
									{format(day, "d")}
								</span>
							</div>

							{/* Holidays */}
							{dayHolidays?.map((holiday) => {
								const isReligious = holiday.type === "religious";
								return (
									<div
										key={holiday.id}
										className={cn(
											"text-[10px] font-medium px-1.5 py-0.5 rounded truncate border",
											isReligious
												? "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-400/10 border-purple-200 dark:border-purple-400/20"
												: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 border-green-200 dark:border-green-400/20",
										)}
										title={`${holiday.name}${holiday.description ? ` - ${holiday.description}` : ""}`}
									>
										<CalendarIcon className="w-2.5 h-2.5 inline mr-0.5" />
										{holiday.name}
									</div>
								);
							})}

							{/* Events */}
							{dayEvents?.map((event) => (
								<div
									key={event.id}
									onClick={(e) => handleEventClick(e, event)}
									className={cn(
										"text-xs px-2 py-1 rounded border truncate shadow-sm transition-all hover:scale-[1.02]",
										event.category
											? `bg-[${event.category.color}]/20 border-[${event.category.color}]/30`
											: "bg-primary/20 border-primary/30",
									)}
								>
									{format(new Date(event.startTime), "HH:mm")} {event.title}
								</div>
							))}
						</div>
					);
				})}
			</div>

			{/* Event Modal */}
			<Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							{editingEvent
								? t("common.edit_event")
								: t("common.create_new_event")}
						</DialogTitle>
					</DialogHeader>
					<EventForm
						onSubmit={handleFormSubmit}
						onCancel={() => setIsEventModalOpen(false)}
						initialData={
							editingEvent ||
							(selectedDate ? { startTime: selectedDate } : undefined)
						}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
