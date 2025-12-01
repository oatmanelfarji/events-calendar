Add Astronomical Seasons Component to Header
Add a component to display the current astronomical season name and icon in the Header. The component will show seasons based on Northern Hemisphere astronomical dates (equinoxes and solstices).

User Review Required
NOTE

Using standard astronomical season dates (equinoxes and solstices):

Spring: March 20/21 (Vernal Equinox)
Summer: June 20/21 (Summer Solstice)
Autumn: September 22/23 (Autumnal Equinox)
Winter: December 21/22 (Winter Solstice)
Data will be included for years 2025-2035. The component will automatically detect the current season based on today's date.

Proposed Changes
Data Layer
[NEW] 
seasons.json
Create a JSON file with season data for 2025-2035 containing:

Season name (spring, summer, autumn, winter)
Start and end dates for each season
Year information
Structure:

{
  "2025": [
    { "name": "spring", "startDate": "2025-03-20", "endDate": "2025-06-20" },
    { "name": "summer", "startDate": "2025-06-21", "endDate": "2025-09-22" },
    { "name": "autumn", "startDate": "2025-09-23", "endDate": "2025-12-20" },
    { "name": "winter", "startDate": "2025-12-21", "endDate": "2026-03-19" }
  ],
  "2026": [...],
  ...
  "2035": [...]
}
Component Layer
[NEW] 
current-season.tsx
Create a new component that:

Imports season data from seasons.json
Determines the current season based on today's date
Displays the season name with an appropriate icon using lucide-react icons:
Spring: Flower2 icon with green/light green background
Summer: Sun icon with yellow/orange background
Autumn: Leaf icon with orange/brown background
Winter: Snowflake icon with blue/light blue background
Uses i18n for season name translation
Styled with Tailwind CSS to match the Header theme
Displays the current date alongside the season
UI Integration
[MODIFY] 
Header.tsx
Add the CurrentSeason component to the middle section of the Header (line 44-46). The component will display both the current date and the current season:

<div className="flex items-center gap-4">
  <CurrentSeason />
</div>
Localization
[MODIFY] 
en/translation.json
[MODIFY] 
fr/translation.json
[MODIFY] 
ar/translation.json
Add season name translations to all three language files under a new seasons key:

{
  "seasons": {
    "spring": "Spring" / "Printemps" / "الربيع",
    "summer": "Summer" / "Été" / "الصيف",
    "autumn": "Autumn" / "Automne" / "الخريف",
    "winter": "Winter" / "Hiver" / "الشتاء"
  }
}
Verification Plan
Manual Verification
Start the development server:

cd /run/media/oatman/2nd/Code/Pro-projects/events-calendar
pnpm dev
Visual inspection:

Open http://localhost:3000 in the browser
Verify the season component appears in the Header center section
Check that the correct season icon and name are displayed
Verify the styling matches the Header theme (card background, border, etc.)
i18n verification:

Use the language switcher to change between English, French, and Arabic
Verify the season name translates correctly in each language
For Arabic, verify RTL layout doesn't break the component
Theme verification:

Toggle between light and dark modes using the ModeToggle
Verify the component colors adapt properly to both themes
Build verification:

pnpm build
Ensure the build completes without errors
Verify seasons.json is properly imported