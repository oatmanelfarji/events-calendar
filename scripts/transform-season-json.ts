
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../src/data/season-start.json');

try {
  const rawData = fs.readFileSync(INPUT_FILE, 'utf-8');
  const data = JSON.parse(rawData);
  const events = [];

  for (const year in data) {
    for (const season in data[year]) {
      const dateStr = data[year][season]; // "YYYY-MM-DD"
      
      // Create date object (UTC)
      // "YYYY-MM-DD" is typically parsed as UTC midnight
      const startDate = new Date(dateStr);
      const startTime = startDate.toISOString();
      
      // End time: 23:59:59.999 UTC
      const endDate = new Date(dateStr);
      endDate.setUTCHours(23, 59, 59, 999);
      const endTime = endDate.toISOString();

      const capitalizedSeason = season.charAt(0).toUpperCase() + season.slice(1);

      events.push({
        title: `${capitalizedSeason} Starts`,
        description: `First day of ${season}`,
        startTime: startTime,
        endTime: endTime,
        isAllDay: true,
        category: 'other', // Matches schema enum
        source: 'local'
      });
    }
  }

  fs.writeFileSync(INPUT_FILE, JSON.stringify(events, null, 2));
  console.log(`Successfully transformed season data into ${events.length} events!`);

} catch (err) {
  console.error("Error transforming season data:", err);
}
