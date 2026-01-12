"use server";

import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { todos } from "@/db/schema";

export const todoSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	isDone: z.boolean().optional(),
	date: z.string().optional().nullable(), // ISO string
});

export const getTodos = createServerFn({ method: "GET" })
	.inputValidator(
		z
			.object({
				start: z.string().optional(),
				end: z.string().optional(),
			})
			.optional(),
	)
	.handler(
		async ({
			data,
		}: {
			data: { start?: string; end?: string } | undefined;
		}) => {
			if (data?.start && data?.end) {
				const startDate = new Date(data.start);
				const endDate = new Date(data.end);
				return await db
					.select()
					.from(todos)
					.where(and(gte(todos.date, startDate), lte(todos.date, endDate)))
					.orderBy(desc(todos.createdAt));
			}

			// If no date range, return all todos (or maybe just undated ones + recent ones? for now all)
			return await db.select().from(todos).orderBy(desc(todos.createdAt));
		},
	);

export const createTodo = createServerFn({ method: "POST" })
	.inputValidator(todoSchema)
	.handler(async ({ data }: { data: z.infer<typeof todoSchema> }) => {
		const newTodo = await db
			.insert(todos)
			.values({
				title: data.title,
				description: data.description,
				isDone: data.isDone || false,
				date: data.date ? new Date(data.date) : null,
			})
			.returning();
		return newTodo[0];
	});

export const updateTodo = createServerFn({ method: "POST" })
	.inputValidator(todoSchema)
	.handler(async ({ data }: { data: z.infer<typeof todoSchema> }) => {
		if (!data.id) throw new Error("ID is required for update");

		const updatedTodo = await db
			.update(todos)
			.set({
				title: data.title,
				description: data.description,
				isDone: data.isDone,
				date: data.date ? new Date(data.date) : null,
				updatedAt: new Date(),
			})
			.where(eq(todos.id, data.id))
			.returning();
		return updatedTodo[0];
	});

export const deleteTodo = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.number() }))
	.handler(async ({ data }: { data: { id: number } }) => {
		await db.delete(todos).where(eq(todos.id, data.id));
		return { success: true };
	});
