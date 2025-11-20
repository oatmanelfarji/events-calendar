Implementation Plan - Events Calendar App
Goal
Create a premium Events Calendar application that allows users to:

View national and religious holidays.
Manage personal events with categories and reminders.
Synchronize events with Nextcloud and Google Calendar.
User Review Required
IMPORTANT

Synchronization Strategy: Syncing with Google Calendar and Nextcloud (CalDAV) requires handling authentication (OAuth2 for Google, Basic/Digest for CalDAV).

For the MVP, we will implement the data model and UI to support sync, but full two-way sync logic might be complex. We will start with a local-first approach and add sync adapters.
Question: Do you have specific libraries in mind for CalDAV, or should we implement a basic fetch-based client?
Proposed Changes
Database Schema
[MODIFY] 

schema.ts
Add holidays table:
id, name, date, countryCode, type, description.
Add events table:
id, title, description, startTime, endTime, isAllDay, location.
categoryId (fk), reminders (jsonb).
syncId, source (local, google, nextcloud), etag.
Add categories table:
id, name, color.
Core Features (Server Functions)
[NEW] 

holidays.ts
fetchHolidays(country, year): Fetch from public API (e.g., Nager.Date) and cache in DB.
getHolidays(range): Retrieve from DB.
[NEW] 

events.ts
CRUD functions: createEvent, updateEvent, deleteEvent, getEvents.
syncEvents: Placeholder for sync logic.
UI Implementation
[NEW] 

CalendarView.tsx
Custom Month/Week/Day view using date-fns and Tailwind Grid.
"Premium" aesthetic: Glassmorphism, smooth transitions, framer-motion (if available/requested) or CSS animations.
[NEW] 

EventForm.tsx
Form using @tanstack/react-form and zod.
Fields: Title, Date/Time, Category, Reminders.
[MODIFY] 

routes
/: Dashboard/Calendar view.
/events/new: Create event page.
/settings: Configure sync and holidays.
Synchronization Strategy
[NEW] 

events.ts
syncEvents: Placeholder for sync logic.
Future: Implement CalDAV and Google Calendar adapters.
Verification Plan
Automated Tests
We will use vitest (already installed) to test server functions.
Command: npm run test (or npx vitest).
New Tests:
src/server/events.test.ts: Test CRUD operations against an in-memory or test DB.
Manual Verification
Holidays:
Go to Settings, select a country (e.g., US or user's locale).
Verify holidays appear on the calendar.
Events:
Click a date on the calendar.
Fill out the "New Event" form.
Save and verify it appears on the grid.
Edit and Delete the event.
UI:
Check responsive layout on mobile/desktop.
Verify "premium" look (colors, spacing, typography).