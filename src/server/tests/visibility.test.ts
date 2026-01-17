import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/db";
import { events, todos } from "@/db/schema";
import { getEvents, getUpcomingEvents } from "../events";
import { getTodos } from "../todos";

// Mock getServerSession
vi.mock("@/lib/auth-server", () => ({
	getServerSession: vi.fn(),
	requireAuth: vi.fn(),
}));

import { getServerSession } from "@/lib/auth-server";

describe("Visibility and Security", () => {
	beforeEach(async () => {
		await db.delete(events);
		await db.delete(todos);
		vi.clearAllMocks();
	});

	describe("Events Visibility", () => {
		it("should return both public and personal events when authenticated", async () => {
			const mockUserId = "test-user-1";
			(getServerSession as any).mockResolvedValue({ user: { id: mockUserId } });

			// Create a public event
			await db.insert(events).values({
				title: "Public Event",
				startTime: new Date(),
				endTime: new Date(Date.now() + 3600000),
				userId: null,
			});

			// Create a personal event
			await db.insert(events).values({
				title: "Personal Event",
				startTime: new Date(),
				endTime: new Date(Date.now() + 3600000),
				userId: mockUserId,
			});

			// Create another user's event
			await db.insert(events).values({
				title: "Other User Event",
				startTime: new Date(),
				endTime: new Date(Date.now() + 3600000),
				userId: "other-user",
			});

			const now = new Date();
			const start = new Date(
				now.getFullYear(),
				now.getMonth(),
				1,
			).toISOString();
			const end = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0,
			).toISOString();

			const results = await getEvents({ data: { start, end } });

			expect(results).toHaveLength(2);
			const titles = results.map((e) => e.title);
			expect(titles).toContain("Public Event");
			expect(titles).toContain("Personal Event");
			expect(titles).not.toContain("Other User Event");
		});

		it("should return only public events when unauthenticated", async () => {
			(getServerSession as any).mockResolvedValue(null);

			await db.insert(events).values({
				title: "Public Event",
				startTime: new Date(),
				endTime: new Date(Date.now() + 3600000),
				userId: null,
			});

			await db.insert(events).values({
				title: "Personal Event",
				startTime: new Date(),
				endTime: new Date(Date.now() + 3600000),
				userId: "some-user",
			});

			const now = new Date();
			const start = new Date(
				now.getFullYear(),
				now.getMonth(),
				1,
			).toISOString();
			const end = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0,
			).toISOString();

			const results = await getEvents({ data: { start, end } });

			expect(results).toHaveLength(1);
			expect(results[0].title).toBe("Public Event");
		});
	});

	describe("Todos Security", () => {
		it("should return personal todos when authenticated", async () => {
			const mockUserId = "test-user-1";
			(getServerSession as any).mockResolvedValue({ user: { id: mockUserId } });

			await db.insert(todos).values({
				title: "My Todo",
				userId: mockUserId,
			});

			await db.insert(todos).values({
				title: "Other Todo",
				userId: "other-user",
			});

			const results = await getTodos();

			expect(results).toHaveLength(1);
			expect(results[0].title).toBe("My Todo");
		});

		it("should return empty array when unauthenticated", async () => {
			(getServerSession as any).mockResolvedValue(null);

			await db.insert(todos).values({
				title: "Some Todo",
				userId: "some-user",
			});

			const results = await getTodos();

			expect(results).toHaveLength(0);
		});
	});
});
