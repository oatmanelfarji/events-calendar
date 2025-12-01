import { z } from "zod";

export const eventFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startTime: z.date(),
	endTime: z.date(),
	isAllDay: z.boolean().default(false),
	location: z.string().optional(),
	categoryId: z.number().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
