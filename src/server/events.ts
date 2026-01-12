"use server";

import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { events } from "@/db/schema";
import type { ReminderConfig } from "@/types";

const ReminderSchema = z.object({
	type: z.enum(["email", "push", "sms"]),
	minutesBefore: z.number(),
});

const EventSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startTime: z.string(), // ISO string
	endTime: z.string(), // ISO string
	isAllDay: z.boolean().default(false),
	location: z.string().optional(),
	category: z
		.enum(["national", "religious", "family", "personal", "other"])
		.optional(),
	reminders: z.array(ReminderSchema).optional(),
});

export const getEvents = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			start: z.string(),
			end: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const { start, end } = data;

		const results = await db
			.select()
			.from(events)
			.where(
				and(
					gte(events.startTime, new Date(start)),
					lte(events.startTime, new Date(end)),
				),
			)
			.orderBy(desc(events.startTime));

		return results.map((event) => ({
			...event,
			reminders: event.reminders as ReminderConfig[] | null,
		}));
	});

export const createEvent = createServerFn({ method: "POST" })
	.inputValidator(EventSchema)
	.handler(async ({ data }) => {
		const [newEvent] = await db
			.insert(events)
			.values({
				...data,
				startTime: new Date(data.startTime),
				endTime: new Date(data.endTime),
			})
			.returning();

		return newEvent as typeof newEvent & { reminders: ReminderConfig[] | null };
	});

export const updateEvent = createServerFn({ method: "POST" })
	.inputValidator(EventSchema.extend({ id: z.number() }))
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

		return updatedEvent as typeof updatedEvent & {
			reminders: ReminderConfig[] | null;
		};
	});

export const deleteEvent = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.number() }))
	.handler(async ({ data }) => {
		await db.delete(events).where(eq(events.id, data.id));
		return { success: true };
	});

export const getUpcomingEvents = createServerFn({ method: "GET" })
	.inputValidator(z.object({ limit: z.number().optional() }).optional())
	.handler(async ({ data }) => {
		const limit = data?.limit ?? 3;
		const now = new Date();

		const results = await db
			.select()
			.from(events)
			.where(gte(events.startTime, now))
			.orderBy(events.startTime)
			.limit(limit);

		return results.map((event) => ({
			...event,
			reminders: event.reminders as ReminderConfig[] | null,
		}));
	});
