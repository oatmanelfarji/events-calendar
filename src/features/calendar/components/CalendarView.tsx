import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import moment from "moment";
import { useState } from "react";
import { CalendarDayCell } from "@/features/calendar/components/CalendarDayCell";
import { CalendarHeader } from "@/features/calendar/components/CalendarHeader";
import { DayHoverTooltip } from "@/features/calendar/components/DayHoverTooltip";
import { EventFormDialog } from "@/features/events/components/EventFormDialog";
import type { EventFormValues } from "@/features/events/schemas";
import { authClient } from "@/lib/auth-client";
import { setupMomentLocale } from "@/lib/date-locale";
import { createEvent, getEvents, updateEvent } from "@/server/events";
import { getHolidays } from "@/server/holidays";
import { getTodos, updateTodo } from "@/server/todos";
import type {
	Event,
	EventCreateInput,
	EventUpdateInput,
	Todo,
	TodoUpdateInput,
} from "@/types";

export function CalendarView() {
	setupMomentLocale();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	const monthStart = moment(currentDate).startOf("month").toDate();
	const monthEnd = moment(monthStart).endOf("month").toDate();
	const startDate = moment(monthStart).startOf("week").toDate();
	const endDate = moment(monthEnd).endOf("week").toDate();

	const calendarDays: Date[] = [];
	const day = moment(startDate);
	const end = moment(endDate);
	while (day.isSameOrBefore(end)) {
		calendarDays.push(day.toDate());
		day.add(1, "day");
	}

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
		mutationFn: (data: TodoUpdateInput) => updateTodo({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		onError: (error) => {
			console.error("Failed to update todo:", error);
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: EventCreateInput) => createEvent({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			setIsEventModalOpen(false);
		},
		onError: (error) => {
			console.error("Failed to create event:", error);
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: EventUpdateInput) => updateEvent({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			setIsEventModalOpen(false);
		},
		onError: (error) => {
			console.error("Failed to update event:", error);
		},
	});

	const handlePrevMonth = () =>
		setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
	const handleNextMonth = () =>
		setCurrentDate(moment(currentDate).add(1, "month").toDate());
	const handleToday = () => setCurrentDate(new Date());

	const handleDayClick = (day: Date) => {
		if (!session) {
			navigate({ to: "/login" });
			return;
		}
		setSelectedDate(day);
		setEditingEvent(null);
		setIsEventModalOpen(true);
	};

	const openEventEditor = (event: Event) => {
		setEditingEvent(event);
		setIsEventModalOpen(true);
	};

	const handleTodoToggle = (todo: Todo) => {
		updateTodoMutation.mutate({
			id: todo.id,
			isDone: !todo.isDone,
			title: todo.title, // Required by schema?
		});
	};

	const handleFormSubmit = (data: EventFormValues) => {
		const payload = {
			...data,
			startTime: data.startTime.toISOString(),
			endTime: data.endTime.toISOString(),
		};

		if (editingEvent) {
			updateMutation.mutate({ ...payload, id: editingEvent.id });
		} else {
			createMutation.mutate(payload);
		}
	};

	// Generate weekday headers based on locale
	const weekDays: string[] = [];
	const startOfWeekDate = moment().startOf("week");
	for (let i = 0; i < 7; i++) {
		weekDays.push(moment(startOfWeekDate).add(i, "days").format("ddd"));
	}

	// Mouse tracking for floating tooltip
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const handleMouseMove = (e: React.MouseEvent) => {
		setMousePos({ x: e.clientX, y: e.clientY });
	};

	return (
		<div className="flex flex-col border border-border rounded-3xl h-full">
			<CalendarHeader
				currentDate={currentDate}
				onPrevMonth={handlePrevMonth}
				onNextMonth={handleNextMonth}
				onToday={handleToday}
				onNewEvent={() => {
					if (!session) {
						navigate({ to: "/login" });
						return;
					}
					setSelectedDate(new Date());
					setEditingEvent(null);
					setIsEventModalOpen(true);
				}}
			/>

			<div className="flex flex-col p-4 gap-4">
				{/* Weekday Headers */}
				<div className="grid grid-cols-7 gap-2">
					{weekDays.map((day) => (
						<div
							key={day}
							className="text-sm font-bold text-muted-foreground uppercase tracking-widest py-2"
						>
							{day}
						</div>
					))}
				</div>

				{/* Calendar Grid */}
				<div
					className="grid grid-cols-7 grid-rows-6 gap-2 h-full"
					onMouseMove={handleMouseMove}
					onMouseLeave={() => setHoveredDay(null)}
				>
					{calendarDays.map((day) => {
						const dayEvents = events?.filter((e) =>
							moment(e.startTime).isSame(day, "day"),
						);
						const dayHolidays = holidays?.filter((h) =>
							moment(h.date).isSame(day, "day"),
						);
						const dayTodos = todos?.filter(
							(todo) => todo.date && moment(todo.date).isSame(day, "day"),
						);

						return (
							<CalendarDayCell
								key={day.toString()}
								day={day}
								currentDate={currentDate}
								events={dayEvents}
								holidays={dayHolidays}
								todos={dayTodos}
								onDayClick={handleDayClick}
								onHover={setHoveredDay}
								onLeave={() => {}} // Handle leave on container
								onEventClick={openEventEditor}
								onTodoToggle={handleTodoToggle}
							/>
						);
					})}

					{/* Hover Tooltip */}
					{hoveredDay && (
						<DayHoverTooltip
							day={hoveredDay}
							events={events?.filter((e) =>
								moment(e.startTime).isSame(hoveredDay, "day"),
							)}
							holidays={holidays?.filter((h) =>
								moment(h.date).isSame(hoveredDay, "day"),
							)}
							todos={todos?.filter(
								(todo) =>
									todo.date && moment(todo.date).isSame(hoveredDay, "day"),
							)}
							onEventClick={openEventEditor}
							position={mousePos}
						/>
					)}
				</div>
			</div>

			{/* Event Modal */}
			<EventFormDialog
				open={isEventModalOpen}
				onOpenChange={setIsEventModalOpen}
				onSubmit={handleFormSubmit}
				isPending={createMutation.isPending || updateMutation.isPending}
				mode={editingEvent ? "edit" : "create"}
				initialValues={
					editingEvent
						? {
								title: editingEvent.title,
								description: editingEvent.description || "",
								startTime: new Date(editingEvent.startTime),
								endTime: new Date(editingEvent.endTime),
								isAllDay: editingEvent.isAllDay || false,
								location: editingEvent.location || "",
								category: editingEvent.category || "personal",
								reminders: editingEvent.reminders || [],
							}
						: selectedDate
							? {
									title: "",
									description: "",
									startTime: selectedDate,
									endTime: new Date(selectedDate.getTime() + 60 * 60 * 1000),
									isAllDay: false,
									location: "",
									category: "personal",
									reminders: [],
								}
							: undefined
				}
			/>
		</div>
	);
}
