import { z } from "zod";

/** Reminder configuration schema matching the server-side definition */
export const ReminderSchema = z.object({
	type: z.enum(["email", "push", "sms"]),
	minutesBefore: z.number().positive("Minutes must be positive"),
});

export type ReminderConfig = z.infer<typeof ReminderSchema>;

/** Base event form schema (before refinement) for type extraction */
const eventFormSchemaBase = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startTime: z.date(),
	endTime: z.date(),
	isAllDay: z.boolean().default(false),
	location: z.string().optional(),
	category: z
		.enum(["national", "religious", "family", "personal", "other"])
		.default("personal"),
	reminders: z.array(ReminderSchema).optional().default([]),
});

/** Event form type derived from the base schema (for react-hook-form compatibility) */
export type EventFormValues = z.infer<typeof eventFormSchemaBase>;

/** Full event form schema with validation refinement */
export const eventFormSchema = eventFormSchemaBase.refine(
	(data) => data.startTime < data.endTime,
	{
		message: "End time must be after start time",
		path: ["endTime"],
	},
);
