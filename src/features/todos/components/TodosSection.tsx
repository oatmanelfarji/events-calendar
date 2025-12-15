import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Plus } from "lucide-react";
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
import { TodoFormDialog } from "@/features/todos/components/TodoFormDialog";
import type { TodoFormValues } from "@/features/todos/schemas";
import { cn } from "@/lib/utils";
import { createTodo } from "@/server/todos";
import type { Todo } from "@/types";

interface TodosSectionProps {
	todos: Todo[];
	icon: React.ElementType;
	bgColor: string;
	textColor: string;
}

export function TodosSection({
	todos,
	icon: Icon,
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
		},
		onError: (error) => {
			console.error("Failed to create todo:", error);
		},
	});

	function onTodoSubmit(data: TodoFormValues) {
		createTodoMutation.mutate(data);
	}

	return (
		<Card className="group h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div
							className={cn(
								"p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
								"bg-linear-to-br from-background to-muted ring-1 ring-inset ring-foreground/5 shadow-sm",
							)}
						>
							<Icon className={cn("w-6 h-6", textColor)} />
						</div>
						<div className="space-y-1">
							<CardTitle className="text-xl font-display tracking-tight">
								{t("common.todos", "Todos")}
							</CardTitle>
							<CardDescription className="text-sm font-medium opacity-80">
								{t("common.upcoming_todos", "Upcoming tasks")}
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col gap-6">
				{activeTodos.length > 0 ? (
					<>
						<div className="space-y-3 flex-1">
							{activeTodos.map((todo) => (
								<div
									key={todo.id}
									className="group/item relative flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-background/40 hover:bg-accent/30 hover:border-accent/50 transition-all duration-300 cursor-default"
								>
									<div className="mt-0.5 shrink-0">
										<div className="h-5 w-5 rounded-full border-2 border-primary/30 group-hover/item:border-primary/60 transition-colors flex items-center justify-center">
											<div className="h-2.5 w-2.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
										</div>
									</div>
									<div className="min-w-0 flex-1 space-y-1">
										<p className="font-medium text-sm leading-tight truncate group-hover/item:text-primary transition-colors">
											{todo.title}
										</p>
										{todo.description && (
											<p className="text-xs text-muted-foreground truncate opacity-80">
												{todo.description}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
						<div className="grid grid-cols-2 gap-3 mt-auto pt-2">
							<Button
								variant="default"
								className="w-full gradient-primary hover:opacity-90 shadow-lg shadow-primary/20 transition-all duration-300"
								onClick={() => setIsTodoDialogOpen(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								{t("common.add_new", "Add New")}
							</Button>
							<Link to="/todos" className="w-full">
								<Button
									variant="secondary"
									className="w-full hover:bg-accent hover:text-accent-foreground transition-colors border border-border/50"
								>
									{t("common.view_all", "View All")}
									<ArrowRight className="w-4 h-4 ml-2 opacity-60" />
								</Button>
							</Link>
						</div>
					</>
				) : (
					<div className="flex-1 flex flex-col">
						<div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-4">
							<div className="p-4 rounded-full bg-muted/50 ring-1 ring-border/50">
								<CheckCircle2 className="w-8 h-8 text-muted-foreground/60" />
							</div>
							<div className="space-y-1 max-w-[200px]">
								<p className="font-medium">
									{t("common.all_caught_up", "All caught up!")}
								</p>
								<p className="text-sm text-muted-foreground">
									{t("common.no_todos_desc", "No active tasks at the moment.")}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-3 pt-4">
							<Button
								variant="default"
								className="w-full gradient-primary hover:opacity-90 shadow-lg shadow-primary/20 transition-all duration-300"
								onClick={() => setIsTodoDialogOpen(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								{t("common.create_task", "Create Task")}
							</Button>
							<Link to="/todos" className="w-full">
								<Button
									variant="ghost"
									className="w-full group/btn hover:bg-accent/50"
								>
									{t("common.go_to_todos", "Go to Todos")}
									<ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
								</Button>
							</Link>
						</div>
					</div>
				)}

				<TodoFormDialog
					open={isTodoDialogOpen}
					onOpenChange={setIsTodoDialogOpen}
					onSubmit={onTodoSubmit}
					isPending={createTodoMutation.isPending}
				/>
			</CardContent>
		</Card>
	);
}
