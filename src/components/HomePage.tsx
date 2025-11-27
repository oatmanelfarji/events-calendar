import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	Calendar,
	Calendar as CalendarIcon,
	CheckCircle2,
	ChevronRight,
	PartyPopper,
	Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { createEvent, getCategories, getEvents } from "@/server/events";
import { getHolidays } from "@/server/holidays";
import { createTodo, getTodos } from "@/server/todos";
import { Button } from "./ui/button";
import { Calendar as CalendarComponent } from "./ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const SLIDE_INTERVAL = 5000; // 5 seconds

// Form schemas
const eventFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startTime: z.date(),
	endTime: z.date(),
	isAllDay: z.boolean().default(false),
	location: z.string().optional(),
	categoryId: z.number().optional(),
});

const todoFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	date: z.date().optional().nullable(),
});

export function HomePage() {
	const { t } = useTranslation();
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
	const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	// Get current month range for events
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	// Fetch data
	const { data: events = [] } = useQuery({
		queryKey: ["events", startOfMonth.toISOString(), endOfMonth.toISOString()],
		queryFn: () =>
			getEvents({
				data: {
					start: startOfMonth.toISOString(),
					end: endOfMonth.toISOString(),
				},
			}),
	});

	const { data: holidays = [] } = useQuery({
		queryKey: ["holidays", now.getFullYear(), "MA"],
		queryFn: () =>
			getHolidays({
				data: {
					year: now.getFullYear(),
					countryCode: "MA",
				},
			}),
	});

	const { data: todos = [] } = useQuery({
		queryKey: ["todos"],
		queryFn: () => getTodos(),
	});

	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});

	// Mutations
	const createEventMutation = useMutation({
		mutationFn: (data: z.infer<typeof eventFormSchema>) =>
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

	const createTodoMutation = useMutation({
		mutationFn: (data: z.infer<typeof todoFormSchema>) =>
			createTodo({
				data: {
					...data,
					date: data.date ? data.date.toISOString() : null,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
			setIsTodoDialogOpen(false);
			todoForm.reset();
		},
	});

	// Forms
	const eventForm = useForm<z.infer<typeof eventFormSchema>>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: {
			title: "",
			description: "",
			startTime: new Date(),
			endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
			isAllDay: false,
			location: "",
		},
	});

	const todoForm = useForm<z.infer<typeof todoFormSchema>>({
		resolver: zodResolver(todoFormSchema),
		defaultValues: {
			title: "",
			description: "",
			date: null,
		},
	});

	function onEventSubmit(data: z.infer<typeof eventFormSchema>) {
		createEventMutation.mutate(data);
	}

	function onTodoSubmit(data: z.infer<typeof todoFormSchema>) {
		createTodoMutation.mutate(data);
	}

	// Auto-advance slides
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % 3);
		}, SLIDE_INTERVAL);

		return () => clearInterval(timer);
	}, []);

	const slides = [
		{
			id: "events",
			title: t("common.events", "Events"),
			icon: Calendar,
			count: events.length,
			color: "from-blue-500 to-cyan-500",
			bgColor: "bg-blue-500/10",
			textColor: "text-blue-500",
		},
		{
			id: "holidays",
			title: t("common.holidays", "Holidays"),
			icon: PartyPopper,
			count: holidays.length,
			color: "from-purple-500 to-pink-500",
			bgColor: "bg-purple-500/10",
			textColor: "text-purple-500",
		},
		{
			id: "todos",
			title: t("common.todos", "Todos"),
			icon: CheckCircle2,
			count: todos.filter((t) => !t.isDone).length,
			color: "from-green-500 to-emerald-500",
			bgColor: "bg-green-500/10",
			textColor: "text-green-500",
		},
	];

	const upcomingEvents = events.slice(0, 5);
	const upcomingHolidays = holidays
		.filter((h) => new Date(h.date) >= now)
		.slice(0, 5);
	const activeTodos = todos.filter((t) => !t.isDone).slice(0, 5);

	return (
		<div className="min-h-screen p-8 space-y-12">
			{/* Hero Slider Section */}
			<div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
				{slides.map((slide, index) => {
					const Icon = slide.icon;
					return (
						<div
							key={slide.id}
							className={cn(
								"absolute inset-0 transition-all duration-700 ease-in-out",
								currentSlide === index
									? "opacity-100 translate-x-0"
									: index < currentSlide
										? "opacity-0 -translate-x-full"
										: "opacity-0 translate-x-full",
							)}
						>
							<div
								className={cn(
									"w-full h-full bg-gradient-to-br flex items-center justify-center",
									slide.color,
								)}
							>
								<div className="text-center text-white space-y-6">
									<div className="flex justify-center">
										<div className="p-6 bg-white/20 backdrop-blur-sm rounded-full">
											<Icon className="w-20 h-20" />
										</div>
									</div>
									<h2 className="text-5xl font-bold">{slide.title}</h2>
									<p className="text-2xl font-semibold">
										{slide.count}{" "}
										{slide.id === "todos"
											? t("common.active", "Active")
											: t("common.total", "Total")}
									</p>
								</div>
							</div>
						</div>
					);
				})}

				{/* Slide Indicators */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
					{slides.map((_, index) => (
						<button
							key={index}
							type="button"
							onClick={() => setCurrentSlide(index)}
							className={cn(
								"w-3 h-3 rounded-full transition-all duration-300",
								currentSlide === index
									? "bg-white w-8"
									: "bg-white/50 hover:bg-white/75",
							)}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			</div>

			{/* Three Sections Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Events Section */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className={cn("p-3 rounded-lg", slides[0].bgColor)}>
									<Calendar className={cn("w-6 h-6", slides[0].textColor)} />
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
																<FormLabel>
																	{t("common.title", "Title")}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Event title..."
																		{...field}
																	/>
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
																					!field.value &&
																						"text-muted-foreground",
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
													{categories.length > 0 && (
														<FormField
															control={eventForm.control}
															name="categoryId"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		{t("common.category", "Category")}
																	</FormLabel>
																	<Select
																		onValueChange={(value) =>
																			field.onChange(Number(value))
																		}
																		value={field.value?.toString()}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select a category" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			{categories.map((cat) => (
																				<SelectItem
																					key={cat.id}
																					value={cat.id.toString()}
																				>
																					{cat.name}
																				</SelectItem>
																			))}
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
													)}
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
															<FormLabel>
																{t("common.title", "Title")}
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="Event title..."
																	{...field}
																/>
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
												{categories.length > 0 && (
													<FormField
														control={eventForm.control}
														name="categoryId"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	{t("common.category", "Category")}
																</FormLabel>
																<Select
																	onValueChange={(value) =>
																		field.onChange(Number(value))
																	}
																	value={field.value?.toString()}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select a category" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{categories.map((cat) => (
																			<SelectItem
																				key={cat.id}
																				value={cat.id.toString()}
																			>
																				{cat.name}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
												)}
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

				{/* Holidays Section */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className={cn("p-3 rounded-lg", slides[1].bgColor)}>
									<PartyPopper className={cn("w-6 h-6", slides[1].textColor)} />
								</div>
								<div>
									<CardTitle>{t("common.holidays", "Holidays")}</CardTitle>
									<CardDescription>
										{t("common.upcoming_holidays", "Upcoming holidays")}
									</CardDescription>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{upcomingHolidays.length > 0 ? (
							<>
								<div className="space-y-3">
									{upcomingHolidays.map((holiday) => (
										<div
											key={holiday.id}
											className="p-3 rounded-lg border hover:bg-accent transition-colors"
										>
											<div className="font-medium truncate">{holiday.name}</div>
											<div className="text-sm text-muted-foreground">
												{format(new Date(holiday.date), "PPP")}
											</div>
										</div>
									))}
								</div>
								<Link to="/holidays">
									<Button variant="outline" className="w-full group">
										{t("common.view_all", "View All")}
										<ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
									</Button>
								</Link>
							</>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								{t("common.no_holidays", "No upcoming holidays")}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Todos Section */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className={cn("p-3 rounded-lg", slides[2].bgColor)}>
									<CheckCircle2
										className={cn("w-6 h-6", slides[2].textColor)}
									/>
								</div>
								<div>
									<CardTitle>{t("common.todos", "Todos")}</CardTitle>
									<CardDescription>
										{t("common.active_todos", "Active tasks")}
									</CardDescription>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{activeTodos.length > 0 ? (
							<>
								<div className="space-y-3">
									{activeTodos.map((todo) => (
										<div
											key={todo.id}
											className="p-3 rounded-lg border hover:bg-accent transition-colors"
										>
											<div className="font-medium truncate">{todo.title}</div>
											{todo.description && (
												<div className="text-sm text-muted-foreground truncate">
													{todo.description}
												</div>
											)}
										</div>
									))}
								</div>
								<div className="flex gap-2">
									<Dialog
										open={isTodoDialogOpen}
										onOpenChange={setIsTodoDialogOpen}
									>
										<DialogTrigger asChild>
											<Button variant="default" className="flex-1">
												<Plus className="w-4 h-4 mr-2" />
												{t("common.add_new", "Add New")}
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-md">
											<DialogHeader>
												<DialogTitle>
													{t("common.create_todo", "Create Todo")}
												</DialogTitle>
											</DialogHeader>
											<Form {...todoForm}>
												<form
													onSubmit={todoForm.handleSubmit(onTodoSubmit)}
													className="space-y-4"
												>
													<FormField
														control={todoForm.control}
														name="title"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	{t("common.title", "Title")}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Todo title..."
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={todoForm.control}
														name="description"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	{t("common.description", "Description")}
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Todo description..."
																		{...field}
																		value={field.value || ""}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={todoForm.control}
														name="date"
														render={({ field }) => (
															<FormItem className="flex flex-col">
																<FormLabel>
																	{t("common.date", "Date")}
																</FormLabel>
																<Popover>
																	<PopoverTrigger asChild>
																		<FormControl>
																			<Button
																				variant="outline"
																				className={cn(
																					"w-full pl-3 text-left font-normal",
																					!field.value &&
																						"text-muted-foreground",
																				)}
																			>
																				{field.value ? (
																					format(field.value, "PPP")
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
																			selected={field.value || undefined}
																			onSelect={field.onChange}
																			initialFocus
																		/>
																	</PopoverContent>
																</Popover>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="flex justify-end gap-2">
														<Button
															type="button"
															variant="outline"
															onClick={() => setIsTodoDialogOpen(false)}
														>
															{t("common.cancel", "Cancel")}
														</Button>
														<Button
															type="submit"
															disabled={createTodoMutation.isPending}
														>
															{createTodoMutation.isPending
																? t("common.creating", "Creating...")
																: t("common.create", "Create")}
														</Button>
													</div>
												</form>
											</Form>
										</DialogContent>
									</Dialog>
									<Link to="/todos" className="flex-1">
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
									{t("common.no_todos", "No active todos")}
								</div>
								<Dialog
									open={isTodoDialogOpen}
									onOpenChange={setIsTodoDialogOpen}
								>
									<DialogTrigger asChild>
										<Button variant="default" className="w-full">
											<Plus className="w-4 h-4 mr-2" />
											{t("common.add_new_todo", "Add New Todo")}
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-md">
										<DialogHeader>
											<DialogTitle>
												{t("common.create_todo", "Create Todo")}
											</DialogTitle>
										</DialogHeader>
										<Form {...todoForm}>
											<form
												onSubmit={todoForm.handleSubmit(onTodoSubmit)}
												className="space-y-4"
											>
												<FormField
													control={todoForm.control}
													name="title"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																{t("common.title", "Title")}
															</FormLabel>
															<FormControl>
																<Input placeholder="Todo title..." {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={todoForm.control}
													name="description"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																{t("common.description", "Description")}
															</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Todo description..."
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={todoForm.control}
													name="date"
													render={({ field }) => (
														<FormItem className="flex flex-col">
															<FormLabel>{t("common.date", "Date")}</FormLabel>
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
																				format(field.value, "PPP")
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
																		selected={field.value || undefined}
																		onSelect={field.onChange}
																		initialFocus
																	/>
																</PopoverContent>
															</Popover>
															<FormMessage />
														</FormItem>
													)}
												/>
												<div className="flex justify-end gap-2">
													<Button
														type="button"
														variant="outline"
														onClick={() => setIsTodoDialogOpen(false)}
													>
														{t("common.cancel", "Cancel")}
													</Button>
													<Button
														type="submit"
														disabled={createTodoMutation.isPending}
													>
														{createTodoMutation.isPending
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
			</div>
		</div>
	);
}
