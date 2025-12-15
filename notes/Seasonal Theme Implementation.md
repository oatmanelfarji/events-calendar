Seasonal Theme Implementation

I have implemented a dynamic seasonal color theme that updates the appearance of buttons, links, and header icons based on the current season.

Changes
1. CSS Variables (
src/styles.css
)
Added seasonal color variables:
--season-spring: Green
--season-summer: Yellow
--season-autumn: Orange
--season-winter: Blue
Created utility classes (.theme-spring, etc.) that map the primary theme color to the season color.
Included dark mode overrides for optimal contrast.
2. Season Theme Handler (
src/components/season-theme-handler.tsx
)
Created a new component that automatically detects the current season.
Applies the corresponding theme class to the document root.
3. Application Integration
Root Component: Mounted 
SeasonThemeHandler
 in 
src/routes/__root.tsx
 so it runs globally.
Season Utilities: Updated 
src/lib/season-utils.ts
 to use the new CSS variables for the season progress bar, ensuring consistency.
Verification
Automated Checks
Ran pnpm check to ensure no TypeScript errors were introduced.
Manual Verification Steps
To verify the changes yourself:

Open the application.
The application looks for the current date to determine the season.
Spring: March 20 - June 20
Summer: June 21 - September 21
Autumn: September 22 - December 20
Winter: December 21 - March 19
Verify that Buttons (primary), Links (hover/active), and Header Icons (active) match the color of the season progress bar.