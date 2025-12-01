import { createFileRoute } from "@tanstack/react-router";
import { TodosPageContent } from "@/features/todos/components/TodosPageContent";

export const Route = createFileRoute("/todos")({
	component: TodosPageContent,
});
