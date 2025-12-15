import { Calendar as CalendarIcon } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import type { Event, EventCategory, Holiday, Todo } from "@/types";

interface CalendarDayCellProps {
	day: Date;
	currentDate: Date;
	events?: Event[];
	holidays?: Holiday[];
	todos?: Todo[];
	onDayClick: (day: Date) => void;
	onHover: (day: Date) => void;
	onLeave: () => void;
	onEventClick: (event: Event) => void;
	onTodoToggle: (todo: Todo) => void;
}

const categoryColors: Record<EventCategory, string> = {
	national: "bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300",
	religious:
		"bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-300",
	family:
		"bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300",
	personal:
		"bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300",
	other: "bg-gray-500/20 border-gray-500/30 text-gray-700 dark:text-gray-300",
};

export function CalendarDayCell({
	day,
	currentDate,
	events,
	holidays,
	todos,
	onDayClick,
	onHover,
	onLeave,
	onEventClick,
	onTodoToggle,
}: CalendarDayCellProps) {
	return (
		<button
			type="button"
			onClick={() => onDayClick(day)}
			onMouseEnter={() => onHover(day)}
			onMouseLeave={onLeave}
			className={cn(
				"bg-card p-2 rounded-xl border border-transparent hover:border-border/50 transition-all duration-200 hover:scale-[1.05] hover:shadow-xl hover:z-10 cursor-pointer flex flex-col gap-1 text-left items-stretch outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden relative group",
				!moment(day).isSame(currentDate, "month") &&
					"bg-muted/10 text-muted-foreground/50 opacity-60 hover:opacity-100",
				moment(day).isSame(moment(), "day") && "bg-primary/5 border-primary/20",
			)}
		>
			<div className="flex justify-between items-start">
				<span
					className={cn(
						"text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300",
						moment(day).isSame(moment(), "day")
							? "bg-primary text-primary-foreground shadow-md scale-110"
							: "text-muted-foreground group-hover:bg-muted/50 group-hover:text-foreground",
					)}
				>
					{moment(day).format("D")}
				</span>
			</div>

			<div className="flex-1 flex flex-col gap-1 min-h-0">
				{/* Holidays */}
				{holidays?.slice(0, 2).map((holiday) => {
					const isReligious = holiday.type === "religious";
					return (
						<div
							key={holiday.id}
							className={cn(
								"text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate border shadow-sm transition-transform hover:scale-105",
								isReligious
									? "text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20"
									: "text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20",
							)}
						>
							<CalendarIcon className="w-2 h-2 inline mr-1 opacity-70" />
							{holiday.name}
						</div>
					);
				})}

				{/* Events */}
				{events?.slice(0, 3).map((event) => (
					<div
						key={event.id}
						onClick={(e) => {
							e.stopPropagation();
							onEventClick(event);
						}}
						className={cn(
							"text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate shadow-sm transition-all hover:scale-105 cursor-pointer w-full text-left border",
							event.category && categoryColors[event.category]
								? categoryColors[event.category]
								: categoryColors.personal,
						)}
					>
						<span className="opacity-70 text-[9px] mr-1 font-mono">
							{moment(event.startTime).format("HH:mm")}
						</span>
						{event.title}
					</div>
				))}

				{/* Todos Bubble */}
				{todos && todos.length > 0 && (
					<div className="mt-auto flex items-center gap-1 text-[9px] font-medium text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded-md w-fit">
						<div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
						{todos?.length} {todos?.length === 1 ? "Todo" : "Todos"}
					</div>
				)}
			</div>
		</button>
	);
}
