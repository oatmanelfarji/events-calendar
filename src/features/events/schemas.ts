import { z } from "zod";

export const eventFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startTime: z.date(),
	endTime: z.date(),
	isAllDay: z.boolean().default(false),
	location: z.string().optional(),
	category: z
		.enum(["national", "religious", "family", "personal", "other"])
		.default("personal"),
	reminders: z.array(z.any()).optional().default([]),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
