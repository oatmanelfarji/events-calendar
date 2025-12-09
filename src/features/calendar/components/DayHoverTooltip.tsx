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
}: DayHoverTooltipProps) {
	return (
		<div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
			<div className="pointer-events-auto glass-strong p-5 rounded-2xl shadow-2xl border border-border/50 w-96 max-h-[600px] overflow-y-auto">
				<div className="space-y-4">
					<div className="font-bold text-lg border-b border-border/50 pb-3">
						{moment(day).format("dddd, MMMM D, YYYY")}
					</div>

					{/* Holidays */}
					{holidays?.map((holiday) => (
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
								<div className="font-semibold text-sm">{holiday.name}</div>
								{holiday.description && (
									<div className="text-xs text-muted-foreground mt-1">
										{holiday.description}
									</div>
								)}
							</div>
						</div>
					))}

					{/* Events */}
					{events?.map((event) => (
						<div key={event.id} className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
								<CalendarIcon className="h-4 w-4" />
								Events
							</div>
							<button
								type="button"
								className={cn(
									"p-3 rounded-xl border-2 cursor-pointer hover:opacity-80 transition-opacity w-full text-left",
									event.category && categoryColors[event.category]
										? categoryColors[event.category]
										: categoryColors.personal,
								)}
								onClick={() => onEventClick(event)}
							>
								<div className="font-semibold text-sm">{event.title}</div>
								<div className="text-xs mt-1 opacity-80">
									{moment(event.startTime).format("HH:mm")}
									{event.location && ` • ${event.location}`}
								</div>
							</button>
						</div>
					))}

					{/* Todos */}
					{todos?.map((todo) => (
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
	);
}
