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
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	PartyPopper,
	Plus,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/features/events/components/EventForm";
import { getDateFnsLocale } from "@/lib/date-locale";
import { cn } from "@/lib/utils";
import { createEvent, getEvents, updateEvent } from "@/server/events";
import { getHolidays } from "@/server/holidays";
import { getTodos, updateTodo } from "@/server/todos";

type Todo = {
	id: number;
	title: string;
	description?: string | null;
	isDone: boolean | null;
	date?: string | null;
};

export function CalendarView() {
	const { t } = useTranslation();
	const locale = getDateFnsLocale();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	// biome-ignore lint/suspicious/noExplicitAny: generic state
	const [editingEvent, setEditingEvent] = useState<any>(null);
	const queryClient = useQueryClient();

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart, { locale });
	const endDate = endOfWeek(monthEnd, { locale });

	const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
	const weeks = calendarDays.length / 7;

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

	// Fetch Todos
	const { data: todos } = useQuery({
		queryKey: ["todos", startDate.toISOString(), endDate.toISOString()],
		queryFn: () =>
			getTodos({
				data: {
					start: startDate.toISOString(),
					end: endDate.toISOString(),
				},
			}),
	});

	const updateTodoMutation = useMutation({
		// biome-ignore lint/suspicious/noExplicitAny: mutation data
		mutationFn: (data: any) => updateTodo({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const createMutation = useMutation({
		// biome-ignore lint/suspicious/noExplicitAny: mutation data
		mutationFn: (data: any) => createEvent({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			setIsEventModalOpen(false);
		},
	});

	const updateMutation = useMutation({
		// biome-ignore lint/suspicious/noExplicitAny: mutation data
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

	const categoryColors: Record<string, string> = {
		national: "bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300",
		religious:
			"bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-300",
		family:
			"bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300",
		personal:
			"bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300",
		other: "bg-gray-500/20 border-gray-500/30 text-gray-700 dark:text-gray-300",
	};

	return (
		<div className="h-full flex flex-col bg-background text-foreground">
			{/* Header */}
			<div className="flex items-center justify-between p-6">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={handlePrevMonth}
							className="hover:bg-accent"
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>
						<h2 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
							{format(currentDate, "MMMM yyyy", { locale })}
						</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNextMonth}
							className="hover:bg-accent"
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
					</div>
					<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setCurrentDate(new Date())}
							className="hover:bg-accent text-sm font-medium mx-2 p-3"
						>
							{t("common.today")}
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
			<div
				className="flex-1 grid grid-cols-7 gap-px bg-border rounded-2xl border border-border overflow-hidden relative"
				style={{
					gridTemplateRows: `auto repeat(${weeks}, minmax(0, 1fr))`,
				}}
			>
				{/* Weekday Headers */}
				{weekDays.map((day) => (
					<div
						key={day}
						className="bg-muted/80 p-2 text-center text-sm font-medium text-muted-foreground border-b border-border"
					>
						{day}
					</div>
				))}

				{/* Days */}
				{calendarDays.map((day) => {
					const dayEvents = events?.filter((e) =>
						isSameDay(new Date(e.startTime), day),
					);
					const dayHolidays = holidays?.filter((h) =>
						isSameDay(new Date(h.date), day),
					);
					const dayTodos = todos?.filter(
						(todo) => todo.date && isSameDay(new Date(todo.date), day),
					);

					const hasItems =
						(dayEvents?.length || 0) > 0 ||
						(dayHolidays?.length || 0) > 0 ||
						(dayTodos?.length || 0) > 0;

					return (
						<div
							key={day.toString()}
							onClick={() => handleDayClick(day)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleDayClick(day);
								}
							}}
							onMouseEnter={() => hasItems && setHoveredDay(day)}
							onMouseLeave={() => setHoveredDay(null)}
							role="button"
							tabIndex={0}
							className={cn(
								"bg-card p-2 transition-colors hover:bg-accent/50 cursor-pointer flex flex-col gap-1 text-left items-stretch outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden",
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

							{/* Todos */}
							{dayTodos?.map((todo) => (
								<button
									type="button"
									key={todo.id}
									onClick={(e) => {
										e.stopPropagation();
										updateTodoMutation.mutate({
											...todo,
											isDone: !todo.isDone,
										});
									}}
									className={cn(
										"text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center gap-1 cursor-pointer transition-all hover:opacity-80 w-full text-left",
										todo.isDone
											? "bg-muted text-muted-foreground border-muted-foreground/20 line-through"
											: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
									)}
								>
									<div
										className={cn(
											"w-2 h-2 rounded-[2px] border flex items-center justify-center shrink-0",
											todo.isDone
												? "border-muted-foreground bg-muted-foreground/20"
												: "border-blue-500",
										)}
									>
										{todo.isDone && (
											<div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
										)}
									</div>
									<span className="truncate">{todo.title}</span>
								</button>
							))}

							{/* Events */}
							{dayEvents?.map((event) => (
								<div
									key={event.id}
									onClick={(e) => handleEventClick(e, event)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleEventClick(e as any, event);
										}
									}}
									role="button"
									tabIndex={0}
									className={cn(
										"text-xs px-2 py-1 rounded border truncate shadow-sm transition-all hover:scale-[1.02] outline-none focus-visible:ring-2 focus-visible:ring-ring",
										event.category && categoryColors[event.category]
											? categoryColors[event.category]
											: categoryColors.personal,
									)}
								>
									{format(new Date(event.startTime), "HH:mm")} {event.title}
								</div>
							))}
						</div>
					);
				})}

				{/* Hover Tooltip */}
				{hoveredDay && (
					<div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
						<div className="pointer-events-auto glass-strong p-5 rounded-2xl shadow-2xl border border-border/50 w-96 max-h-[600px] overflow-y-auto">
							<div className="space-y-4">
								<div className="font-bold text-lg border-b border-border/50 pb-3">
									{format(hoveredDay, "EEEE, MMMM d, yyyy", { locale })}
								</div>

								{/* Holidays */}
								{holidays
									?.filter((h) => isSameDay(new Date(h.date), hoveredDay))
									.map((holiday) => (
										<div key={holiday.id} className="space-y-2">
											<div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
												<PartyPopper className="h-4 w-4" />
												Holidays
											</div>
											<div
												className={cn(
													"p-3 rounded-xl border-2",
													holiday.type === "religious"
														? "bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700"
														: "bg-green-50 dark:bg-green-950/50 border-green-300 dark:border-green-700",
												)}
											>
												<div className="font-semibold text-sm">
													{holiday.name}
												</div>
												{holiday.description && (
													<div className="text-xs text-muted-foreground mt-1">
														{holiday.description}
													</div>
												)}
											</div>
										</div>
									))}

								{/* Events */}
								{events
									?.filter((e) => isSameDay(new Date(e.startTime), hoveredDay))
									.map((event) => (
										<div key={event.id} className="space-y-2">
											<div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
												<CalendarIcon className="h-4 w-4" />
												Events
											</div>
											<div
												className={cn(
													"p-3 rounded-xl border-2 cursor-pointer hover:opacity-80 transition-opacity",
													event.category && categoryColors[event.category]
														? categoryColors[event.category]
														: categoryColors.personal,
												)}
												onClick={() =>
													handleEventClick(
														new MouseEvent("click") as any,
														event,
													)
												}
											>
												<div className="font-semibold text-sm">
													{event.title}
												</div>
												<div className="text-xs mt-1 opacity-80">
													{format(new Date(event.startTime), "HH:mm")}
													{event.location && ` • ${event.location}`}
												</div>
											</div>
										</div>
									))}

								{/* Todos */}
								{todos
									?.filter(
										(todo) =>
											todo.date && isSameDay(new Date(todo.date), hoveredDay),
									)
									.map((todo) => (
										<div key={todo.id} className="space-y-2">
											<div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
												<CheckCircle2 className="h-4 w-4" />
												Todos
											</div>
											<div
												className={cn(
													"p-3 rounded-xl border-2 flex items-start gap-3",
													todo.isDone
														? "bg-muted/50 border-muted-foreground/30 opacity-60"
														: "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700",
												)}
											>
												<div
													className={cn(
														"w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0",
														todo.isDone
															? "border-muted-foreground bg-muted-foreground/20"
															: "border-blue-500",
													)}
												>
													{todo.isDone && (
														<div className="w-3 h-3 bg-current rounded-sm" />
													)}
												</div>
												<div className="flex-1">
													<div
														className={cn(
															"font-semibold text-sm",
															todo.isDone && "line-through",
														)}
													>
														{todo.title}
													</div>
													{todo.description && (
														<div className="text-xs text-muted-foreground mt-1">
															{todo.description}
														</div>
													)}
												</div>
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				)}
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
