import { sql } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { events } from "@/db/schema";
import { createEvent, getUpcomingEvents } from "../events";

describe("getUpcomingEvents", () => {
	beforeEach(async () => {
		// Clean up events table
		await db.delete(events);
	});

	it("should return upcoming events ordered by start time", async () => {
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(now.getDate() + 1);

		const dayAfter = new Date(now);
		dayAfter.setDate(now.getDate() + 2);

		const pastDate = new Date(now);
		pastDate.setDate(now.getDate() - 1);

		// Create test events
		await createEvent({
			data: {
				title: "Tomorrow Event",
				startTime: tomorrow.toISOString(),
				endTime: new Date(tomorrow.getTime() + 3600000).toISOString(),
				reminders: [],
			},
		});

		await createEvent({
			data: {
				title: "Day After Event",
				startTime: dayAfter.toISOString(),
				endTime: new Date(dayAfter.getTime() + 3600000).toISOString(),
				reminders: [],
			},
		});

		await createEvent({
			data: {
				title: "Past Event",
				startTime: pastDate.toISOString(),
				endTime: new Date(pastDate.getTime() + 3600000).toISOString(),
				reminders: [],
			},
		});

		const result = await getUpcomingEvents({ data: { limit: 10 } });

		expect(result).toHaveLength(2);
		expect(result[0].title).toBe("Tomorrow Event");
		expect(result[1].title).toBe("Day After Event");
	});

	it("should respect the limit parameter", async () => {
		const now = new Date();
		const futureDate = new Date(now);
		futureDate.setDate(now.getDate() + 10);

		await createEvent({
			data: {
				title: "Event 1",
				startTime: futureDate.toISOString(),
				endTime: new Date(futureDate.getTime() + 3600000).toISOString(),
				reminders: [],
			},
		});

		await createEvent({
			data: {
				title: "Event 2",
				startTime: new Date(futureDate.getTime() + 1000).toISOString(),
				endTime: new Date(futureDate.getTime() + 3601000).toISOString(),
				reminders: [],
			},
		});

		const result = await getUpcomingEvents({ data: { limit: 1 } });
		expect(result).toHaveLength(1);
		expect(result[0].title).toBe("Event 1");
	});
});
