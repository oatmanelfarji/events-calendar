import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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

interface EventFormProps {
	defaultValues?: Partial<EventFormValues>;
	onSubmit: (data: EventFormValues) => void;
	onCancel: () => void;
	isPending?: boolean;
}

export function EventForm({
	defaultValues,
	onSubmit,
	onCancel,
	isPending,
}: EventFormProps) {
	const { t } = useTranslation();

	const form = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: {
			title: "",
			description: "",
			isAllDay: false,
			location: "",
			category: "personal",
			reminders: [],
			...defaultValues,
			startTime: defaultValues?.startTime
				? new Date(defaultValues.startTime)
				: new Date(),
			endTime: defaultValues?.endTime
				? new Date(defaultValues.endTime)
				: new Date(Date.now() + 60 * 60 * 1000),
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
								<Input placeholder="Event title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="startTime"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>{t("common.start_time", "Start Time")}</FormLabel>
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
													moment(field.value).format("MMM D, YYYY HH:mm")
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
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
										/>
										<div className="p-3 border-t">
											<Input
												type="time"
												value={moment(field.value).format("HH:mm")}
												onChange={(e) => {
													const [hours, minutes] = e.target.value.split(":");
													const newDate = new Date(field.value);
													newDate.setHours(Number(hours));
													newDate.setMinutes(Number(minutes));
													field.onChange(newDate);
												}}
											/>
										</div>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="endTime"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>{t("common.end_time", "End Time")}</FormLabel>
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
													moment(field.value).format("MMM D, YYYY HH:mm")
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
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
										/>
										<div className="p-3 border-t">
											<Input
												type="time"
												value={moment(field.value).format("HH:mm")}
												onChange={(e) => {
													const [hours, minutes] = e.target.value.split(":");
													const newDate = new Date(field.value);
													newDate.setHours(Number(hours));
													newDate.setMinutes(Number(minutes));
													field.onChange(newDate);
												}}
											/>
										</div>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="isAllDay"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>{t("common.all_day", "All Day Event")}</FormLabel>
							</div>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("common.location", "Location")}</FormLabel>
							<FormControl>
								<Input placeholder="Location" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("common.category", "Category")}</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="personal">Personal</SelectItem>
									<SelectItem value="work">Work</SelectItem>
									<SelectItem value="family">Family</SelectItem>
									<SelectItem value="national">National</SelectItem>
									<SelectItem value="religious">Religious</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
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
								<Textarea placeholder="Description" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end gap-2">
					<Button type="button" variant="outline" onClick={onCancel}>
						{t("common.cancel", "Cancel")}
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Saving..." : t("common.save", "Save")}
					</Button>
				</div>
			</form>
		</Form>
	);
}
