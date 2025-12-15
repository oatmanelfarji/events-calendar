import {
	Calendar as CalendarIcon,
	CheckCircle2,
	PartyPopper,
} from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import type { Event, EventCategory, Holiday, Todo } from "@/types";

interface DayHoverTooltipProps {
	day: Date;
	events?: Event[];
	holidays?: Holiday[];
	todos?: Todo[];
	onEventClick: (event: Event) => void;
	position: { x: number; y: number };
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

export function DayHoverTooltip({
	day,
	events,
	holidays,
	todos,
	onEventClick,
	position,
}: DayHoverTooltipProps) {
	// Calculate position to keep tooltip on screen
	// Offset by 20px from cursor
	let left = position.x + 20;
	let top = position.y + 20;

	// Simple boundary detection (assuming 1920x1080 approx, could be robustified with window dimensions)
	if (typeof window !== "undefined") {
		if (left + 384 > window.innerWidth) {
			// 384 is w-96
			left = position.x - 404; // width + offset
		}
		if (top + 500 > window.innerHeight) {
			top = window.innerHeight - 520;
		}
	}

	return (
		<div
			className="fixed z-50 pointer-events-none transition-all duration-75 ease-out"
			style={{
				left: `${left}px`,
				top: `${top}px`,
			}}
		>
			<div className="glass-strong p-4 rounded-xl shadow-xl border border-border/50 w-80 max-h-[500px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
				<div className="font-bold text-base border-b border-border/50 pb-2 mb-2 bg-muted/20 -mx-4 -mt-4 px-4 py-3 flex items-center justify-between">
					<span>{moment(day).format("dddd, MMM D")}</span>
					{moment(day).isSame(new Date(), "day") && (
						<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-wider">
							Today
						</span>
					)}
				</div>

				<div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
					{!events?.length && !holidays?.length && !todos?.length && (
						<div className="text-center text-muted-foreground py-8 text-sm italic opacity-70">
							No activities regarding this day
						</div>
					)}

					{/* Holidays */}
					{holidays?.map((holiday) => (
						<div key={holiday.id} className="space-y-1">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								<PartyPopper className="h-3 w-3" />
								Holidays
							</div>
							<div
								className={cn(
									"p-2.5 rounded-lg border text-sm shadow-sm",
									holiday.type === "religious"
										? "bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
										: "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
								)}
							>
								<div className="font-semibold">{holiday.name}</div>
								{holiday.description && (
									<div className="text-xs opacity-80 mt-0.5 show-on-hover">
										{holiday.description}
									</div>
								)}
							</div>
						</div>
					))}

					{/* Events */}
					{events?.map((event) => (
						<div key={event.id} className="space-y-1">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								<CalendarIcon className="h-3 w-3" />
								Events
							</div>
							<div
								onClick={() => onEventClick(event)}
								className={cn(
									"p-2.5 rounded-lg border text-sm shadow-sm transition-all hover:shadow-md cursor-pointer hover:scale-[1.02]",
									event.category && categoryColors[event.category]
										? categoryColors[event.category]
										: categoryColors.personal,
								)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										onEventClick(event);
									}
								}}
							>
								<div className="font-semibold flex justify-between gap-2">
									<span className="truncate">{event.title}</span>
									<span className="text-xs font-mono opacity-80 whitespace-nowrap">
										{moment(event.startTime).format("HH:mm")}
									</span>
								</div>
								{event.location && (
									<div className="text-xs opacity-80 mt-0.5 truncate flex items-center gap-1">
										<span>📍</span> {event.location}
									</div>
								)}
							</div>
						</div>
					))}

					{/* Todos */}
					{todos?.map((todo) => (
						<div key={todo.id} className="space-y-1">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								<CheckCircle2 className="h-3 w-3" />
								Todos
							</div>
							<div
								className={cn(
									"p-2.5 rounded-lg border flex items-start gap-3 shadow-sm",
									todo.isDone
										? "bg-muted/50 border-border opacity-60"
										: "bg-background border-border",
								)}
							>
								<div
									className={cn(
										"w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0",
										todo.isDone
											? "border-primary bg-primary text-primary-foreground"
											: "border-muted-foreground",
									)}
								>
									{todo.isDone && (
										<div className="w-2 h-2 bg-current rounded-full" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div
										className={cn(
											"font-medium text-sm truncate",
											todo.isDone && "line-through text-muted-foreground",
										)}
									>
										{todo.title}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
