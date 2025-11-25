import { createFileRoute } from "@tanstack/react-router";
import { CalendarView } from "../components/Calendar/CalendarView";

export const Route = createFileRoute("/events")({
	component: EventsPage,
});

function EventsPage() {
	return (
		<div className="h-[calc(80vh-4rem)]">
			<CalendarView />
		</div>
	);
}
