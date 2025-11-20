import { createServerFn } from "@tanstack/start";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { categories, events } from "../db/schema";

const EventSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startTime: z.string(), // ISO string
	endTime: z.string(), // ISO string
	isAllDay: z.boolean().default(false),
	location: z.string().optional(),
	categoryId: z.number().optional(),
	reminders: z.array(z.any()).optional(), // Define stricter schema later
});

export const getEvents = createServerFn({ method: "GET" })
	.validator((data: { start: string; end: string }) => data)
	.handler(async ({ data }) => {
		const { start, end } = data;

		const results = await db
			.select({
				event: events,
				category: categories,
			})
			.from(events)
			.leftJoin(categories, eq(events.categoryId, categories.id))
			.where(
				and(
					gte(events.startTime, new Date(start)),
					lte(events.startTime, new Date(end)),
				),
			)
			.orderBy(desc(events.startTime));

		return results.map(({ event, category }) => ({
			...event,
			category,
		}));
	});

export const createEvent = createServerFn({ method: "POST" })
	.validator(EventSchema)
	.handler(async ({ data }) => {
		const [newEvent] = await db
			.insert(events)
			.values({
				...data,
				startTime: new Date(data.startTime),
				endTime: new Date(data.endTime),
			})
			.returning();

		return newEvent;
	});

export const updateEvent = createServerFn({ method: "POST" })
	.validator(EventSchema.extend({ id: z.number() }))
	.handler(async ({ data }) => {
		const { id, ...values } = data;

		const [updatedEvent] = await db
			.update(events)
			.set({
				...values,
				startTime: new Date(values.startTime),
				endTime: new Date(values.endTime),
				updatedAt: new Date(),
			})
			.where(eq(events.id, id))
			.returning();

		return updatedEvent;
	});

export const deleteEvent = createServerFn({ method: "POST" })
	.validator((data: { id: number }) => data)
	.handler(async ({ data }) => {
		await db.delete(events).where(eq(events.id, data.id));
		return { success: true };
	});

export const getCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db.select().from(categories);
	},
);
