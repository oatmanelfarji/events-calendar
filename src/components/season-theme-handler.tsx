import { useEffect } from "react";
import { getCurrentSeason } from "@/lib/season-utils";

export function SeasonThemeHandler() {
	useEffect(() => {
		const updateSeasonTheme = () => {
			const season = getCurrentSeason();
			if (!season) return;

			const root = document.documentElement;
			// Remove existing theme classes
			root.classList.remove(
				"theme-spring",
				"theme-summer",
				"theme-autumn",
				"theme-winter",
			);

			// Add new theme class
			root.classList.add(`theme-${season.name.toLowerCase()}`);
		};

		// Initial update
		updateSeasonTheme();

		// Check daily for season change (optional, but good for long-running tabs)
		const interval = setInterval(updateSeasonTheme, 1000 * 60 * 60 * 24);

		return () => clearInterval(interval);
	}, []);

	return null;
}
