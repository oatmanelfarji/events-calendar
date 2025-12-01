import { createFileRoute } from "@tanstack/react-router";
import { CalendarView } from "@/features/calendar/components/CalendarView";

export const Route = createFileRoute("/events")({
	component: EventsPage,
});

function EventsPage() {
	return (
		<div className="flex items-center justify-center w-full h-full py-8">
			<div className="w-[80vw] h-[80vh] shadow-2xl rounded-2xl overflow-hidden border border-border/50 ring-1 ring-border/50 bg-background">
				<CalendarView />
			</div>
		</div>
	);
}
