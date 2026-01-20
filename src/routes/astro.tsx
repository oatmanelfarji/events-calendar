import { createFileRoute } from "@tanstack/react-router";
import { AstroPageContent } from "@/features/astro/components/AstroPageContent";

export const Route = createFileRoute("/astro")({
	component: AstroPageContent,
});
