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
				"bg-card p-2 transition-colors hover:bg-accent/50 cursor-pointer flex flex-col gap-1 text-left items-stretch outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden",
				!moment(day).isSame(currentDate, "month") &&
					"bg-muted/30 text-muted-foreground",
				moment(day).isSame(moment(), "day") && "bg-accent/80",
			)}
		>
			<div className="flex justify-between items-start">
				<span
					className={cn(
						"text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
						moment(day).isSame(moment(), "day")
							? "bg-primary text-primary-foreground shadow-lg"
							: "text-muted-foreground",
					)}
				>
					{moment(day).format("D")}
				</span>
			</div>

			{/* Holidays */}
			{holidays?.map((holiday) => {
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
			{todos?.map((todo) => (
				<div
					key={todo.id}
					onClick={(e) => {
						e.stopPropagation();
						onTodoToggle(todo);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.stopPropagation();
							onTodoToggle(todo);
						}
					}}
					role="button"
					tabIndex={0}
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
				</div>
			))}

			{/* Events */}
			{events?.map((event) => (
				<div
					key={event.id}
					onClick={(e) => {
						e.stopPropagation();
						onEventClick(event);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.stopPropagation();
							onEventClick(event);
						}
					}}
					role="button"
					tabIndex={0}
					className={cn(
						"text-xs px-2 py-1 rounded border truncate shadow-sm transition-all hover:scale-[1.02] outline-none focus-visible:ring-2 focus-visible:ring-ring w-full text-left",
						event.category && categoryColors[event.category]
							? categoryColors[event.category]
							: categoryColors.personal,
					)}
				>
					{moment(event.startTime).format("HH:mm")} {event.title}
				</div>
			))}
		</button>
	);
}
