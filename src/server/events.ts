"use server";

import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { events } from "@/db/schema";
import type { ReminderConfig } from "@/types";

const ReminderSchema = z.object({
	type: z.enum(["email", "push", "sms"]),
	minutesBefore: z.number().positive("Minutes must be positive"),
});

const EventSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		description: z.string().optional(),
		startTime: z.iso.datetime({ message: "Invalid start time format" }),
		endTime: z.iso.datetime({ message: "Invalid end time format" }),
		isAllDay: z.boolean().default(false),
		location: z.string().optional(),
		category: z
			.enum(["national", "religious", "family", "personal", "other"])
			.optional(),
		reminders: z.array(ReminderSchema).optional(),
	})
	.refine((data) => new Date(data.startTime) < new Date(data.endTime), {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export const getEvents = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			start: z.iso.datetime(),
			end: z.iso.datetime(),
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

		if (process.env.NODE_ENV === "development") {
			console.log("[getEvents] results:", results);
		}

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

		if (!newEvent) {
			throw new Error("Failed to create event");
		}

		return newEvent as typeof newEvent & { reminders: ReminderConfig[] | null };
	});

export const updateEvent = createServerFn({ method: "POST" })
	.inputValidator(EventSchema.and(z.object({ id: z.number() })))
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

		if (!updatedEvent) {
			throw new Error(
				"Event not found or you don't have permission to update it",
			);
		}

		return updatedEvent as typeof updatedEvent & {
			reminders: ReminderConfig[] | null;
		};
	});

export const deleteEvent = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.number() }))
	.handler(async ({ data }) => {
		const result = await db
			.delete(events)
			.where(eq(events.id, data.id))
			.returning({ id: events.id });

		if (result.length === 0) {
			throw new Error(
				"Event not found or you don't have permission to delete it",
			);
		}

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
