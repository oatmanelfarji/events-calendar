import { z } from "zod";

export const todoFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	date: z.date().optional().nullable(),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;
