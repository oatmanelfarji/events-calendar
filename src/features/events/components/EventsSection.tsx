import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
	type EventFormValues,
	eventFormSchema,
} from "@/features/events/schemas";
import { cn } from "@/lib/utils";
import { createEvent } from "@/server/events";
import type { Event } from "@/types";

interface EventsSectionProps {
	events: Event[];
	icon: React.ElementType;
	bgColor: string;
	textColor: string;
	startOfMonth: Date;
	endOfMonth: Date;
}

export function EventsSection({
	events,
	icon: Icon,
	bgColor,
	textColor,
	startOfMonth,
	endOfMonth,
}: EventsSectionProps) {
	const { t } = useTranslation();
	const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	const upcomingEvents = events.slice(0, 5);

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
						</div>
					</>
				) : (
					<>
						<div className="text-center py-8 text-muted-foreground">
							{t("common.no_events", "No upcoming events")}
						</div>
						<Button
							variant="default"
							className="w-full"
							onClick={() => setIsEventDialogOpen(true)}
						>
							<Plus className="w-4 h-4 mr-2" />
							{t("common.add_new_event", "Add New Event")}
						</Button>
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
