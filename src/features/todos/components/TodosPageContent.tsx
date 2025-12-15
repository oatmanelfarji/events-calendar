import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { createTodo, deleteTodo, getTodos, updateTodo } from "@/server/todos";

export function TodosPageContent() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();

	const { data: todos } = useQuery({
		queryKey: ["todos"],
		queryFn: () => getTodos(),
	});

	const createMutation = useMutation({
		mutationFn: (data: TodoFormValues) =>
			createTodo({
				data: {
					...data,
					date: data.date ? data.date.toISOString() : null,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
			setIsCreateOpen(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: any) =>
			updateTodo({
				data: {
					...data,
					date: data.date
						? typeof data.date === "string"
							? data.date
							: data.date.toISOString()
						: null,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteTodo({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const form = useForm<TodoFormValues>({
		resolver: zodResolver(todoFormSchema),
		defaultValues: {
			title: "",
			description: "",
			date: null,
		},
	});

	function onSubmit(data: TodoFormValues) {
		createMutation.mutate(data);
		form.reset();
	}

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
					{t("common.todos", "Todos")}
				</h1>
				<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={(e) => {
								if (!session) {
									e.preventDefault();
									navigate({ to: "/login" });
								}
							}}
						>
							<Plus className="w-4 h-4 mr-2" />
							{t("common.new_todo", "New Todo")}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{t("common.create_new_todo", "Create New Todo")}
							</DialogTitle>
							<DialogDescription>
								{t(
									"common.create_new_todo_description",
									"Add a new task to your list.",
								)}
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
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
									control={form.control}
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
									control={form.control}
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
																moment(field.value).format("MMM D, YYYY")
															) : (
																<span>
																	{t("common.pick_a_date", "Pick a date")}
																</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value || undefined}
														onSelect={field.onChange}
														disabled={(date) => date < new Date("1900-01-01")}
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
										onClick={() => setIsCreateOpen(false)}
									>
										{t("common.cancel", "Cancel")}
									</Button>
									<Button type="submit">{t("common.create", "Create")}</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="space-y-4">
				{todos?.map((todo) => (
					<div
						key={todo.id}
						className={cn(
							"flex items-center justify-between p-4 rounded-lg border bg-card transition-all hover:shadow-md",
							todo.isDone && "opacity-60 bg-muted/50",
						)}
					>
						<div className="flex items-center gap-4 flex-1">
							<Checkbox
								checked={todo.isDone || false}
								onCheckedChange={(checked) => {
									updateMutation.mutate({
										...todo,
										isDone: checked === true,
									});
								}}
							/>
							<div className="flex flex-col gap-1">
								<span
									className={cn(
										"font-medium",
										todo.isDone && "line-through text-muted-foreground",
									)}
								>
									{todo.title}
								</span>
								{todo.description && (
									<span className="text-sm text-muted-foreground">
										{todo.description}
									</span>
								)}
								{todo.date && (
									<div className="flex items-center gap-1 text-xs text-muted-foreground">
										<CalendarIcon className="w-3 h-3" />
										{moment(todo.date).format("MMM D, YYYY")}
									</div>
								)}
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="text-destructive hover:text-destructive hover:bg-destructive/10"
							onClick={() => deleteMutation.mutate(todo.id)}
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				))}
				{todos?.length === 0 && (
					<div className="text-center py-12 text-muted-foreground">
						{t("common.no_todos", "No todos yet. Create one to get started!")}
					</div>
				)}
			</div>
		</div>
	);
}
