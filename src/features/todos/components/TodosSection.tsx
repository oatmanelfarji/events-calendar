import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
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
import { type TodoFormValues, todoFormSchema } from "@/features/todos/schemas";
import { cn } from "@/lib/utils";
import { createTodo } from "@/server/todos";

interface TodosSectionProps {
	todos: any[]; // Replace with proper type
	icon: React.ElementType;
	bgColor: string;
	textColor: string;
}

export function TodosSection({
	todos,
	icon: Icon,
	bgColor,
	textColor,
}: TodosSectionProps) {
	const { t } = useTranslation();
	const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	const activeTodos = todos.filter((t) => !t.isDone).slice(0, 5);

	const createTodoMutation = useMutation({
		mutationFn: (data: TodoFormValues) =>
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

	const todoForm = useForm<TodoFormValues>({
		resolver: zodResolver(todoFormSchema),
		defaultValues: {
			title: "",
			description: "",
			date: null,
		},
	});

	function onTodoSubmit(data: TodoFormValues) {
		createTodoMutation.mutate(data);
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
											{t("common.create_new_todo", "Create New Todo")}
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
														<FormLabel>{t("common.title", "Title")}</FormLabel>
														<FormControl>
															<Input
																placeholder="Buy groceries..."
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
															<Input
																placeholder="Details..."
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
																		variant={"outline"}
																		className={cn(
																			"w-full pl-3 text-left font-normal",
																			!field.value && "text-muted-foreground",
																		)}
																	>
																		{field.value ? (
																			format(field.value, "PPP")
																		) : (
																			<span>
																				{t("common.pick_a_date", "Pick a date")}
																			</span>
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
																	disabled={(date) =>
																		date < new Date("1900-01-01")
																	}
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
												<Button type="submit">
													{t("common.create", "Create")}
												</Button>
											</div>
										</form>
									</Form>
								</DialogContent>
							</Dialog>
						</div>
					</>
				) : (
					<>
						<div className="text-center py-8 text-muted-foreground">
							{t("common.no_todos", "No active todos")}
						</div>
						<Dialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
							<DialogTrigger asChild>
								<Button variant="default" className="w-full">
									<Plus className="w-4 h-4 mr-2" />
									{t("common.add_new_todo", "Add New Todo")}
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle>
										{t("common.create_new_todo", "Create New Todo")}
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
													<FormLabel>{t("common.title", "Title")}</FormLabel>
													<FormControl>
														<Input placeholder="Buy groceries..." {...field} />
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
														<Input
															placeholder="Details..."
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
																	variant={"outline"}
																	className={cn(
																		"w-full pl-3 text-left font-normal",
																		!field.value && "text-muted-foreground",
																	)}
																>
																	{field.value ? (
																		format(field.value, "PPP")
																	) : (
																		<span>
																			{t("common.pick_a_date", "Pick a date")}
																		</span>
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
																disabled={(date) =>
																	date < new Date("1900-01-01")
																}
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
											<Button type="submit">
												{t("common.create", "Create")}
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
