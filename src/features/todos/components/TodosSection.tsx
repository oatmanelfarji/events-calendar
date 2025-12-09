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
		},
		onError: (error) => {
			console.error("Failed to create todo:", error);
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
							<Button
								variant="default"
								className="flex-1"
								onClick={() => setIsTodoDialogOpen(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								{t("common.add_new", "Add New")}
							</Button>
						</div>
					</>
				) : (
					<>
						<div className="text-center py-8 text-muted-foreground">
							{t("common.no_todos", "No active todos")}
						</div>
						<Button
							variant="default"
							className="w-full"
							onClick={() => setIsTodoDialogOpen(true)}
						>
							<Plus className="w-4 h-4 mr-2" />
							{t("common.add_new_todo", "Add New Todo")}
						</Button>
					</>
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
