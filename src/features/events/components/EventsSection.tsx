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
		<Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 border-border/50 overflow-hidden relative">
			{/* Subtle gradient overlay */}
			<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<CardHeader className="relative">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="p-4 rounded-2xl gradient-primary shadow-lg shadow-primary/20 ring-2 ring-primary/10 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
							<Icon className="w-7 h-7 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
								{t("common.events", "Events")}
							</CardTitle>
							<CardDescription className="text-sm">
								{t("common.upcoming_events", "Upcoming this month")}
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4 relative">
				{upcomingEvents.length > 0 ? (
					<>
						<div className="space-y-3">
							{upcomingEvents.map((event) => (
								<div
									key={event.id}
									className="p-4 rounded-xl border border-border/50 hover:bg-accent/5 hover:border-primary/20 transition-all duration-300 hover:shadow-md hover:translate-x-2 group/item"
								>
									<div className="font-semibold truncate group-hover/item:text-primary transition-colors">
										{event.title}
									</div>
									<div className="text-sm text-muted-foreground mt-1">
										{format(new Date(event.startTime), "PPP")}
									</div>
								</div>
							))}
						</div>
						<div className="flex gap-2.5 pt-2">
							<Dialog
								open={isEventDialogOpen}
								onOpenChange={setIsEventDialogOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="default"
										className="flex-1 gradient-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
									>
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
								<Button
									variant="outline"
									className="w-full group border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
								>
									{t("common.view_all", "View All")}
									<ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
								</Button>
							</Link>
						</div>
					</>
				) : (
					<>
						<div className="text-center py-12 text-muted-foreground">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
								<Icon className="w-8 h-8" />
							</div>
							<p className="font-medium">
								{t("common.no_events", "No upcoming events")}
							</p>
						</div>
						<Dialog
							open={isEventDialogOpen}
							onOpenChange={setIsEventDialogOpen}
						>
							<DialogTrigger asChild>
								<Button
									variant="default"
									className="w-full gradient-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
								>
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
