import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const eventSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startTime: z.string(),
	endTime: z.string(),
	isAllDay: z.boolean(),
	location: z.string().optional(),
	category: z
		.enum(["national", "religious", "family", "personal", "other"])
		.optional(),
});

type EventFormProps = {
	onSubmit: (data: any) => void;
	initialData?: any;
	onCancel: () => void;
};

export function EventForm({ onSubmit, initialData, onCancel }: EventFormProps) {
	const { t } = useTranslation();

	const form = useForm({
		defaultValues: {
			title: initialData?.title || "",
			description: initialData?.description || "",
			startTime: initialData?.startTime
				? new Date(initialData.startTime).toISOString().slice(0, 16)
				: new Date().toISOString().slice(0, 16),
			endTime: initialData?.endTime
				? new Date(initialData.endTime).toISOString().slice(0, 16)
				: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
			isAllDay: initialData?.isAllDay || false,
			location: initialData?.location || "",
			category: initialData?.category || "personal",
		},
		validatorAdapter: zodValidator(),
		validators: {
			onChange: eventSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field
				name="title"
				children={(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name} className="text-slate-300">
							{t("common.title")}
						</Label>
						<Input
							id={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="bg-slate-900 border-slate-700 text-slate-100"
						/>
						{field.state.meta.errors ? (
							<p className="text-red-400 text-sm">
								{field.state.meta.errors.join(", ")}
							</p>
						) : null}
					</div>
				)}
			/>

			<div className="grid grid-cols-2 gap-4">
				<form.Field
					name="startTime"
					children={(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name} className="text-slate-300">
								{t("common.start_time")}
							</Label>
							<Input
								id={field.name}
								type="datetime-local"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="bg-slate-900 border-slate-700 text-slate-100"
							/>
						</div>
					)}
				/>
				<form.Field
					name="endTime"
					children={(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name} className="text-slate-300">
								{t("common.end_time")}
							</Label>
							<Input
								id={field.name}
								type="datetime-local"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="bg-slate-900 border-slate-700 text-slate-100"
							/>
						</div>
					)}
				/>
			</div>

			<form.Field
				name="isAllDay"
				children={(field) => (
					<div className="flex items-center space-x-2">
						<Checkbox
							id={field.name}
							checked={field.state.value}
							onCheckedChange={(checked) => field.handleChange(!!checked)}
							className="border-slate-700 data-[state=checked]:bg-cyan-600"
						/>
						<Label htmlFor={field.name} className="text-slate-300">
							{t("common.all_day_event")}
						</Label>
					</div>
				)}
			/>

			<form.Field
				name="location"
				children={(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name} className="text-slate-300">
							{t("common.location")}
						</Label>
						<Input
							id={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="bg-slate-900 border-slate-700 text-slate-100"
						/>
					</div>
				)}
			/>

			<form.Field
				name="category"
				children={(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name} className="text-slate-300">
							{t("common.category")}
						</Label>
						<Select
							value={field.state.value}
							onValueChange={field.handleChange}
						>
							<SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
								<SelectValue placeholder={t("common.select_category")} />
							</SelectTrigger>
							<SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
								<SelectItem value="national">National</SelectItem>
								<SelectItem value="religious">Religious</SelectItem>
								<SelectItem value="family">Family</SelectItem>
								<SelectItem value="personal">Personal</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			/>

			<form.Field
				name="description"
				children={(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name} className="text-slate-300">
							{t("common.description")}
						</Label>
						<Textarea
							id={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="bg-slate-900 border-slate-700 text-slate-100"
						/>
					</div>
				)}
			/>

			<div className="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
				>
					{t("common.cancel")}
				</Button>
				<Button
					type="submit"
					className="bg-cyan-600 hover:bg-cyan-700 text-white"
				>
					{t("common.save_event")}
				</Button>
			</div>
		</form>
	);
}
