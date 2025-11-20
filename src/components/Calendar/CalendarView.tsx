import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	addMonths,
	subMonths,
	isSameMonth,
	isSameDay,
	isToday,
} from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Plus,
} from "lucide-react";
import { useState } from "react";
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
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<any>(null);
	const queryClient = useQueryClient();

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart);
	const endDate = endOfWeek(monthEnd);

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

	// Fetch Holidays (assuming US for now, should come from settings context)
	const { data: holidays } = useQuery({
		queryKey: ["holidays", currentDate.getFullYear(), "US"],
		queryFn: () =>
			getHolidays({
				data: { year: currentDate.getFullYear(), countryCode: "US" },
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

	return (
		<div className="h-full flex flex-col bg-slate-950 text-slate-100">
			{/* Header */}
			<div className="flex items-center justify-between p-6 bg-slate-900/50 backdrop-blur-md border-b border-slate-800">
				<div className="flex items-center gap-4">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
						{format(currentDate, "MMMM yyyy")}
					</h2>
					<div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={handlePrevMonth}
							className="hover:bg-slate-700 text-slate-400 hover:text-white"
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setCurrentDate(new Date())}
							className="hover:bg-slate-700 text-slate-400 hover:text-white text-sm font-medium px-3"
						>
							Today
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNextMonth}
							className="hover:bg-slate-700 text-slate-400 hover:text-white"
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
					className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20"
				>
					<Plus className="w-4 h-4 mr-2" /> New Event
				</Button>
			</div>

			{/* Calendar Grid */}
			<div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] gap-px bg-slate-800 overflow-hidden">
				{/* Weekday Headers */}
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						key={day}
						className="bg-slate-900/80 p-3 text-center text-sm font-medium text-slate-400 border-b border-slate-800"
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
								"bg-slate-900/30 p-2 min-h-[100px] transition-colors hover:bg-slate-800/50 cursor-pointer flex flex-col gap-1",
								!isSameMonth(day, currentDate) &&
									"bg-slate-950/50 text-slate-600",
								isToday(day) && "bg-slate-800/80",
							)}
						>
							<div className="flex justify-between items-start">
								<span
									className={cn(
										"text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
										isToday(day)
											? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/40"
											: "text-slate-400",
									)}
								>
									{format(day, "d")}
								</span>
							</div>

							{/* Holidays */}
							{dayHolidays?.map((holiday) => (
								<div
									key={holiday.id}
									className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded truncate border border-emerald-400/20"
									title={holiday.name}
								>
									{holiday.name}
								</div>
							))}

							{/* Events */}
							{dayEvents?.map((event) => (
								<div
									key={event.id}
									onClick={(e) => handleEventClick(e, event)}
									className={cn(
										"text-xs px-2 py-1 rounded border truncate shadow-sm transition-all hover:scale-[1.02]",
										event.category
											? `bg-[${event.category.color}]/20 border-[${event.category.color}]/30 text-slate-200`
											: "bg-blue-500/20 border-blue-500/30 text-blue-200",
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
				<DialogContent className="bg-slate-900 border-slate-700 text-slate-100 sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							{editingEvent ? "Edit Event" : "Create New Event"}
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
