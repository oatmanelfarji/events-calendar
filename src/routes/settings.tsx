import { createFileRoute } from "@tanstack/react-router";
import { SettingsPageContent } from "@/features/settings/components/SettingsPageContent";

export const Route = createFileRoute("/settings")({
	component: SettingsPageContent,
});
