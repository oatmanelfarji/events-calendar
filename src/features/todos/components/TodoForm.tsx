import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

interface TodoFormProps {
	defaultValues?: Partial<TodoFormValues>;
	onSubmit: (data: TodoFormValues) => void;
	onCancel: () => void;
	isPending?: boolean;
}

export function TodoForm({
	defaultValues,
	onSubmit,
	onCancel,
	isPending,
}: TodoFormProps) {
	const { t } = useTranslation();

	const form = useForm<TodoFormValues>({
		resolver: zodResolver(todoFormSchema),
		defaultValues: {
			title: "",
			description: "",
			date: null,
			...defaultValues,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
							<FormLabel>{t("common.description", "Description")}</FormLabel>
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
												<span>{t("common.pick_date", "Pick a date")}</span>
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
					<Button type="button" variant="outline" onClick={onCancel}>
						{t("common.cancel", "Cancel")}
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Saving..." : t("common.create", "Create")}
					</Button>
				</div>
			</form>
		</Form>
	);
}
