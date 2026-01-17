"use server";

import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { events } from "@/db/schema";
import { getServerSession, requireAuth } from "@/lib/auth-server";
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

		// Get session to filter by user if logged in
		const session = await getServerSession();
		const userId = session?.user?.id;

		// Get public events (userId = null) and user's own events if authenticated
		const userCondition = userId
			? or(isNull(events.userId), eq(events.userId, userId))
			: isNull(events.userId);

		const results = await db
			.select()
			.from(events)
			.where(
				and(
					gte(events.startTime, new Date(start)),
					lte(events.startTime, new Date(end)),
					userCondition,
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
		const session = await requireAuth();

		const [newEvent] = await db
			.insert(events)
			.values({
				...data,
				startTime: new Date(data.startTime),
				endTime: new Date(data.endTime),
				userId: session.user.id,
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
		const session = await requireAuth();
		const { id, ...values } = data;

		const [updatedEvent] = await db
			.update(events)
			.set({
				...values,
				startTime: new Date(values.startTime),
				endTime: new Date(values.endTime),
				updatedAt: new Date(),
			})
			.where(and(eq(events.id, id), eq(events.userId, session.user.id)))
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
		const session = await requireAuth();

		const result = await db
			.delete(events)
			.where(and(eq(events.id, data.id), eq(events.userId, session.user.id)))
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
		const session = await getServerSession();
		const userId = session?.user?.id;
		const limit = data?.limit ?? 3;
		const now = new Date();

		const userCondition = userId
			? or(isNull(events.userId), eq(events.userId, userId))
			: isNull(events.userId);

		const results = await db
			.select()
			.from(events)
			.where(and(gte(events.startTime, now), userCondition))
			.orderBy(events.startTime)
			.limit(limit);

		return results.map((event) => ({
			...event,
			reminders: event.reminders as ReminderConfig[] | null,
		}));
	});
