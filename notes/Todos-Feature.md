Add Todos Feature
Goal Description
Add a full-featured Todos management system to the application. This includes a dedicated route for creating and listing todos, and integration with the existing Calendar view to display todos alongside events and holidays.

User Review Required
IMPORTANT

I am adding a date field to the todos table to allow them to be displayed on the calendar. This assumes todos can be associated with a specific date.

Proposed Changes
Database
[MODIFY] 
schema.ts
Uncomment and update todos table definition.
Add date column (timestamp) to todos table.
Add isDone, description, and updatedAt columns.
Backend / Server
[NEW] 
todos.ts
Implement getTodos (with optional date range filter).
Implement createTodo.
Implement updateTodo (for toggling status and editing).
Implement deleteTodo.
Frontend - Routes
[NEW] 
todos.tsx
Create a new page at /todos.
Display a list of all todos.
Provide a form to create new todos.
Allow toggling completion status.
Frontend - Components
[MODIFY] 
CalendarView.tsx
Add useQuery to fetch todos for the current month view.
Render todos in the calendar grid (distinct visual style from events, e.g., a checkbox icon).
Verification Plan
Automated Tests
Run pnpm test to ensure no regressions.
Manual Verification
Database Migration: Run pnpm drizzle-kit push (or generate/migrate) and verify the table is created.
Todos Route:
Navigate to /todos.
Create a new todo with a date.
Create a new todo without a date.
Verify list updates.
Toggle a todo's "done" status.
Calendar Integration:
Navigate to the Calendar.
Verify the todo with a date appears on the correct day.
Verify the todo without a date does NOT appear (or appears in a sidebar if we decide to implement that, but for now just date-based).
Click a todo on the calendar to see details (optional, maybe just read-only for now or simple toggle).