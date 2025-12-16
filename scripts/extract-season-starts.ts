
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEASONS_FILE_PATH = path.join(__dirname, '../src/data/seasons.json');
const OUTPUT_FILE_PATH = path.join(__dirname, '../src/data/season-start.json');

// Interface matching the structure of seasons.json
interface Season {
  name: string;
  startDate: string;
  endDate: string;
}

interface SeasonsData {
  [year: string]: Season[];
}

// Interface for the output format
interface SeasonStartData {
  [year: string]: {
    [seasonName: string]: string;
  };
}

async function extractSeasonStarts() {
  try {
    console.log(`Reading seasons data from ${SEASONS_FILE_PATH}...`);
    const rawData = fs.readFileSync(SEASONS_FILE_PATH, 'utf-8');
    const seasonsData: SeasonsData = JSON.parse(rawData);

    const seasonStarts: SeasonStartData = {};

    // Filter years from 2025 to 2035
    const startYear = 2025;
    const endYear = 2035;

    for (let year = startYear; year <= endYear; year++) {
      const yearStr = year.toString();
      if (seasonsData[yearStr]) {
        seasonStarts[yearStr] = {};
        
        seasonsData[yearStr].forEach((season) => {
          seasonStarts[yearStr][season.name] = season.startDate;
        });
      }
    }

    console.log(`Writing season start dates to ${OUTPUT_FILE_PATH}...`);
    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(seasonStarts, null, 2));
    
    console.log('Done!');
  } catch (error) {
    console.error('Error extracting season starts:', error);
    process.exit(1);
  }
}

extractSeasonStarts();
