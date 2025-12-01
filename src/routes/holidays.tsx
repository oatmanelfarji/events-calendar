import { createFileRoute } from "@tanstack/react-router";
import { HolidaysPageContent } from "@/features/holidays/components/HolidaysPageContent";

export const Route = createFileRoute("/holidays")({
	component: HolidaysPageContent,
});
