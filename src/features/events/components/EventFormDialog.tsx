import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/features/events/components/EventForm";
import type { EventFormValues } from "@/features/events/schemas";

interface EventFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: EventFormValues) => void;
	initialValues?: Partial<EventFormValues>;
	isPending?: boolean;
	mode?: "create" | "edit";
}

export function EventFormDialog({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
	isPending,
	mode = "create",
}: EventFormDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit"
							? t("events.edit_event", "Edit Event")
							: t("events.new_event", "New Event")}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? t("events.edit_event_description", "Update event details.")
							: t(
									"events.new_event_description",
									"Fill in the details for the new event.",
								)}
					</DialogDescription>
				</DialogHeader>
				<EventForm
					defaultValues={initialValues}
					onSubmit={onSubmit}
					onCancel={() => onOpenChange(false)}
					isPending={isPending}
				/>
			</DialogContent>
		</Dialog>
	);
}
