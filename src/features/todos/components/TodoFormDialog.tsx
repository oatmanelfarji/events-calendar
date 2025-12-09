import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TodoForm } from "@/features/todos/components/TodoForm";
import type { TodoFormValues } from "@/features/todos/schemas";

interface TodoFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: TodoFormValues) => void;
	initialValues?: Partial<TodoFormValues>;
	isPending?: boolean;
	mode?: "create" | "edit";
}

export function TodoFormDialog({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
	isPending,
	mode = "create",
}: TodoFormDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit"
							? t("todos.edit_todo", "Edit Todo")
							: t("todos.new_todo", "New Todo")}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? t("todos.edit_todo_description", "Update todo details.")
							: t(
									"todos.new_todo_description",
									"Fill in the details for the new todo.",
								)}
					</DialogDescription>
				</DialogHeader>
				<TodoForm
					defaultValues={initialValues}
					onSubmit={onSubmit}
					onCancel={() => onOpenChange(false)}
					isPending={isPending}
				/>
			</DialogContent>
		</Dialog>
	);
}
