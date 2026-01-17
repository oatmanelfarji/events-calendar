"use server";

import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { getServerSession, requireAuth } from "@/lib/auth-server";

export const todoSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	isDone: z.boolean().optional(),
	date: z.string().datetime().optional().nullable(),
});

export const getTodos = createServerFn({ method: "GET" })
	.inputValidator(
		z
			.object({
				start: z.string().datetime().optional(),
				end: z.string().datetime().optional(),
			})
			.optional(),
	)
	.handler(async ({ data }) => {
		const session = await getServerSession();
		const userId = session?.user?.id;

		// If no user is authenticated, return an empty array to prevent data leak
		if (!userId) {
			return [];
		}

		const conditions = [eq(todos.userId, userId)];

		// Filter by date range if provided
		if (data?.start && data?.end) {
			conditions.push(
				gte(todos.date, new Date(data.start)),
				lte(todos.date, new Date(data.end)),
			);
		}

		return await db
			.select()
			.from(todos)
			.where(and(...conditions))
			.orderBy(desc(todos.createdAt));
	});

export const createTodo = createServerFn({ method: "POST" })
	.inputValidator(todoSchema)
	.handler(async ({ data }) => {
		const session = await requireAuth();

		const [newTodo] = await db
			.insert(todos)
			.values({
				title: data.title,
				description: data.description,
				isDone: data.isDone || false,
				date: data.date ? new Date(data.date) : null,
				userId: session.user.id,
			})
			.returning();

		if (!newTodo) {
			throw new Error("Failed to create todo");
		}

		return newTodo;
	});

export const updateTodo = createServerFn({ method: "POST" })
	.inputValidator(todoSchema)
	.handler(async ({ data }) => {
		if (!data.id) throw new Error("ID is required for update");

		const session = await requireAuth();

		const [updatedTodo] = await db
			.update(todos)
			.set({
				title: data.title,
				description: data.description,
				isDone: data.isDone,
				date: data.date ? new Date(data.date) : null,
				updatedAt: new Date(),
			})
			.where(and(eq(todos.id, data.id), eq(todos.userId, session.user.id)))
			.returning();

		if (!updatedTodo) {
			throw new Error(
				"Todo not found or you don't have permission to update it",
			);
		}

		return updatedTodo;
	});

export const deleteTodo = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.number() }))
	.handler(async ({ data }) => {
		const session = await requireAuth();

		const result = await db
			.delete(todos)
			.where(and(eq(todos.id, data.id), eq(todos.userId, session.user.id)))
			.returning({ id: todos.id });

		if (result.length === 0) {
			throw new Error(
				"Todo not found or you don't have permission to delete it",
			);
		}

		return { success: true };
	});
