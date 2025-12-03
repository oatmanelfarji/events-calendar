import { createFileRoute } from "@tanstack/react-router";
import { CalendarView } from "@/features/calendar/components/CalendarView";

export const Route = createFileRoute("/events")({
	component: EventsPage,
});

function EventsPage() {
	return (
		<div className="flex items-center justify-center w-full h-full py-8">
			<div className="w-[80vw] h-[80vh] overflow-hidden">
				<CalendarView />
			</div>
		</div>
	);
}
