import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EventFormDialog } from "@/features/events/components/EventFormDialog";
import { type EventFormValues } from "@/features/events/schemas";
import { cn } from "@/lib/utils";
import { createEvent } from "@/server/events";
import type { Event } from "@/types";

interface EventsSectionProps {
	events: Event[];
	icon: React.ElementType;
	bgColor: string;
	textColor: string;
}

export function EventsSection({
	events,
	icon: Icon,
	bgColor,
	textColor,
}: EventsSectionProps) {
	const { t } = useTranslation();
	const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	const upcomingEvents = events
		.filter((event) => new Date(event.startTime) > new Date())
		.sort(
			(a, b) =>
				new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
		)
		.slice(0, 3);

	const createEventMutation = useMutation({
		mutationFn: (data: EventFormValues) =>
			createEvent({
				data: {
					...data,
					startTime: data.startTime.toISOString(),
					endTime: data.endTime.toISOString(),
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			setIsEventDialogOpen(false);
		},
		onError: (error) => {
			console.error("Failed to create event:", error);
		},
	});

	function onEventSubmit(data: EventFormValues) {
		createEventMutation.mutate(data);
	}

	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className={cn("p-3 rounded-lg", bgColor)}>
							<Icon className={cn("w-6 h-6", textColor)} />
						</div>
						<div>
							<CardTitle>{t("common.events", "Events")}</CardTitle>
							<CardDescription>
								{t("common.upcoming_events", "Upcoming events")}
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{upcomingEvents.length > 0 ? (
					<>
						<div className="space-y-3">
							{upcomingEvents.map((event) => (
								<div
									key={event.id}
									className="p-3 rounded-lg border hover:bg-accent transition-colors"
								>
									<div className="font-medium truncate">{event.title}</div>
									<div className="text-sm text-muted-foreground">
										{new Date(event.startTime).toLocaleDateString()}
									</div>
								</div>
							))}
						</div>
						<div className="flex gap-2">
							<Button
								variant="default"
								className="flex-1"
								onClick={() => setIsEventDialogOpen(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								{t("common.add_new", "Add New")}
							</Button>
							<Link to="/events" className="flex-1">
								<Button variant="secondary" className="w-full">
									{t("common.view_all_events", "View All Events")}
								</Button>
							</Link>
						</div>
					</>
				) : (
					<>
						<div className="text-center py-8 text-muted-foreground">
							{t("common.no_events", "No upcoming events")}
						</div>
						<div className="flex flex-col gap-2">
							<Button
								variant="default"
								className="w-full"
								onClick={() => setIsEventDialogOpen(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								{t("common.add_new_event", "Add New Event")}
							</Button>
							<Link to="/events" className="w-full">
								<Button variant="secondary" className="w-full">
									{t("common.view_all_events", "View All Events")}
								</Button>
							</Link>
						</div>
					</>
				)}

				<EventFormDialog
					open={isEventDialogOpen}
					onOpenChange={setIsEventDialogOpen}
					onSubmit={onEventSubmit}
					isPending={createEventMutation.isPending}
				/>
			</CardContent>
		</Card>
	);
}
