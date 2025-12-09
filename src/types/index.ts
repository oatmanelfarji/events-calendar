/**
 * Centralized TypeScript types for the Events Calendar application.
 * These types mirror the database schema defined in src/db/schema.ts
 */

// Category enum matching database categoryEnum
export type EventCategory =
	| "national"
	| "religious"
	| "family"
	| "personal"
	| "other";

// Reminder configuration for events
export interface ReminderConfig {
	type: "email" | "push" | "sms";
	minutesBefore: number;
}

// Event type matching the events table schema
export interface Event {
	id: number;
	title: string;
	description?: string | null;
	startTime: Date | string;
	endTime: Date | string;
	isAllDay?: boolean | null;
	location?: string | null;
	category?: EventCategory | null;
	reminders?: ReminderConfig[] | null;
	syncId?: string | null;
	source?: string | null;
	etag?: string | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}

// Todo type matching the todos table schema
export interface Todo {
	id: number;
	title: string;
	description?: string | null;
	isDone?: boolean | null;
	date?: Date | string | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}

// Holiday type matching the holidays table schema
export interface Holiday {
	id: number;
	name: string;
	localName?: string | null;
	date: string;
	countryCode: string;
	type?: string | null;
	description?: string | null;
	createdAt?: Date | null;
}

// Season type matching the seasons table schema
export interface Season {
	id: number;
	name: string;
	startDate: string;
	endDate: string;
	year: string;
	createdAt?: Date | null;
}

// Form input types (for react-hook-form)
export interface EventFormInput {
	title: string;
	description?: string;
	startTime: Date;
	endTime: Date;
	isAllDay?: boolean;
	location?: string;
	category?: EventCategory;
	reminders?: ReminderConfig[];
}

export interface TodoFormInput {
	title: string;
	description?: string;
	date?: Date | null;
}

// Server function input/output types
export interface EventCreateInput {
	title: string;
	description?: string;
	startTime: string;
	endTime: string;
	isAllDay?: boolean;
	location?: string;
	category?: EventCategory;
	reminders?: ReminderConfig[];
}

export interface EventUpdateInput extends EventCreateInput {
	id: number;
}

export interface TodoCreateInput {
	title: string;
	description?: string;
	isDone?: boolean;
	date?: string | null;
}

export interface TodoUpdateInput extends TodoCreateInput {
	id: number;
}
