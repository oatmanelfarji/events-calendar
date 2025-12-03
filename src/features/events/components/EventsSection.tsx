import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	type EventFormValues,
	eventFormSchema,
} from "@/features/events/schemas";
import { cn } from "@/lib/utils";
import { createEvent } from "@/server/events";

interface EventsSectionProps {
	events: any[]; // Replace with proper type
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
			queryClient.invalidateQueries({
				queryKey: [
					"events",
					startOfMonth.toISOString(),
					endOfMonth.toISOString(),
				],
			});
			setIsEventDialogOpen(false);
			eventForm.reset();
		},
	});

	const eventForm = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: {
			title: "",
			description: "",
			startTime: new Date(),
			endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
			isAllDay: false,
			location: "",
			category: "personal",
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
								{t("common.upcoming_events", "Upcoming this month")}
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
										{format(new Date(event.startTime), "PPP")}
									</div>
								</div>
							))}
						</div>
						<div className="flex gap-2">
							<Dialog
								open={isEventDialogOpen}
								onOpenChange={setIsEventDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="default" className="flex-1">
										<Plus className="w-4 h-4 mr-2" />
										{t("common.add_new", "Add New")}
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
									<DialogHeader>
										<DialogTitle>
											{t("common.create_event", "Create Event")}
										</DialogTitle>
									</DialogHeader>
									<Form {...eventForm}>
										<form
											onSubmit={eventForm.handleSubmit(onEventSubmit)}
											className="space-y-4"
										>
											<FormField
												control={eventForm.control}
												name="title"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{t("common.title", "Title")}</FormLabel>
														<FormControl>
															<Input placeholder="Event title..." {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={eventForm.control}
												name="description"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															{t("common.description", "Description")}
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Event description..."
																{...field}
																value={field.value || ""}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={eventForm.control}
												name="startTime"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel>
															{t("common.start_time", "Start Time")}
														</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant="outline"
																		className={cn(
																			"w-full pl-3 text-left font-normal",
																			!field.value && "text-muted-foreground",
																		)}
																	>
																		{field.value ? (
																			format(field.value, "PPP p")
																		) : (
																			<span>Pick a date</span>
																		)}
																		<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto p-0"
																align="start"
															>
																<CalendarComponent
																	mode="single"
																	selected={field.value}
																	onSelect={field.onChange}
																	initialFocus
																/>
															</PopoverContent>
														</Popover>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={eventForm.control}
												name="location"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															{t("common.location", "Location")}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Event location..."
																{...field}
																value={field.value || ""}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={eventForm.control}
												name="category"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															{t("common.category", "Category")}
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select a category" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="national">
																	National
																</SelectItem>
																<SelectItem value="religious">
																	Religious
																</SelectItem>
																<SelectItem value="family">Family</SelectItem>
																<SelectItem value="personal">
																	Personal
																</SelectItem>
																<SelectItem value="other">Other</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											<div className="flex justify-end gap-2">
												<Button
													type="button"
													variant="outline"
													onClick={() => setIsEventDialogOpen(false)}
												>
													{t("common.cancel", "Cancel")}
												</Button>
												<Button
													type="submit"
													disabled={createEventMutation.isPending}
												>
													{createEventMutation.isPending
														? t("common.creating", "Creating...")
														: t("common.create", "Create")}
												</Button>
											</div>
										</form>
									</Form>
								</DialogContent>
							</Dialog>
							<Link to="/events" className="flex-1">
								<Button variant="outline" className="w-full group">
									{t("common.view_all", "View All")}
									<ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
						</div>
					</>
				) : (
					<>
						<div className="text-center py-8 text-muted-foreground">
							{t("common.no_events", "No upcoming events")}
						</div>
						<Dialog
							open={isEventDialogOpen}
							onOpenChange={setIsEventDialogOpen}
						>
							<DialogTrigger asChild>
								<Button variant="default" className="w-full">
									<Plus className="w-4 h-4 mr-2" />
									{t("common.add_new_event", "Add New Event")}
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>
										{t("common.create_event", "Create Event")}
									</DialogTitle>
								</DialogHeader>
								<Form {...eventForm}>
									<form
										onSubmit={eventForm.handleSubmit(onEventSubmit)}
										className="space-y-4"
									>
										<FormField
											control={eventForm.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("common.title", "Title")}</FormLabel>
													<FormControl>
														<Input placeholder="Event title..." {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={eventForm.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("common.description", "Description")}
													</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Event description..."
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={eventForm.control}
											name="startTime"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>
														{t("common.start_time", "Start Time")}
													</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant="outline"
																	className={cn(
																		"w-full pl-3 text-left font-normal",
																		!field.value && "text-muted-foreground",
																	)}
																>
																	{field.value ? (
																		format(field.value, "PPP p")
																	) : (
																		<span>Pick a date</span>
																	)}
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-0"
															align="start"
														>
															<CalendarComponent
																mode="single"
																selected={field.value}
																onSelect={field.onChange}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={eventForm.control}
											name="location"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("common.location", "Location")}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Event location..."
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={eventForm.control}
											name="category"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("common.category", "Category")}
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select a category" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="national">National</SelectItem>
															<SelectItem value="religious">
																Religious
															</SelectItem>
															<SelectItem value="family">Family</SelectItem>
															<SelectItem value="personal">Personal</SelectItem>
															<SelectItem value="other">Other</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<div className="flex justify-end gap-2">
											<Button
												type="button"
												variant="outline"
												onClick={() => setIsEventDialogOpen(false)}
											>
												{t("common.cancel", "Cancel")}
											</Button>
											<Button
												type="submit"
												disabled={createEventMutation.isPending}
											>
												{createEventMutation.isPending
													? t("common.creating", "Creating...")
													: t("common.create", "Create")}
											</Button>
										</div>
									</form>
								</Form>
							</DialogContent>
						</Dialog>
					</>
				)}
			</CardContent>
		</Card>
	);
}
