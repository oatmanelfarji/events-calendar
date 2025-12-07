import fs from 'node:fs';
import path from 'node:path';
import moment from 'moment-hijri';

// Define holidays with their Hijri month, day, and extra metadata
const holidaysDef = [
    { 
        name: "Islamic New Year", 
        localName: "رأس السنة الهجرية",
        month: 1, 
        day: 1,
        description: "The first day of the Islamic lunar calendar year."
    },
    { 
        name: "Ashura", 
        localName: "عاشوراء",
        month: 1, 
        day: 10,
        description: "The 10th day of Muharram."
    },
    { 
        name: "Prophet's Birthday", 
        localName: "عيد المولد النبوي",
        month: 3, 
        day: 12,
        description: "The birthday of the Islamic prophet Muhammad."
    },
    { 
        name: "Isra and Mi'raj", 
        localName: "الإسراء والمعراج",
        month: 7, 
        day: 27,
        description: "The night journey and ascension of the Prophet Muhammad."
    },
    { 
        name: "Mid-Sha'ban", 
        localName: "النصف من شعبان",
        month: 8, 
        day: 15,
        description: "The 15th night of Sha'ban."
    },
    { 
        name: "Start of Ramadan", 
        localName: "بداية رمضان",
        month: 9, 
        day: 1,
        description: "The first day of the holy month of fasting."
    },
    { 
        name: "Eid al-Fitr", 
        localName: "عيد الفطر",
        month: 10, 
        day: 1,
        description: "Festival of Breaking the Fast, marking the end of Ramadan."
    },
    { 
        name: "Arafat Day", 
        localName: "يوم عرفة",
        month: 12, 
        day: 9,
        description: "The day before Eid al-Adha."
    },
    { 
        name: "Eid al-Adha", 
        localName: "عيد الأضحى",
        month: 12, 
        day: 10,
        description: "Festival of the Sacrifice."
    },
];

interface IslamicHoliday {
    name: string;
    localName: string;
    date: string; // ISO format YYYY-MM-DD
    countryCode: string;
    type: string;
    description: string;
    hijriDate: string; // Keeping this for reference/display if needed
}

const generateHolidays = () => {
    const startDate = moment('2025-01-01', 'YYYY-MM-DD');
    const endDate = moment('2035-12-31', 'YYYY-MM-DD');
    
    // Approximate Hijri years covering 2025-2035
    const startHijriYear = 1445;
    const endHijriYear = 1460;

    const allHolidays: IslamicHoliday[] = [];

    for (let year = startHijriYear; year <= endHijriYear; year++) {
        for (const def of holidaysDef) {
            const hijriDateStr = `${year}-${def.month}-${def.day}`;
            const m = moment(hijriDateStr, 'iYYYY-iM-iD');
            
            // Check if valid date
            if (!m.isValid()) {
                console.warn(`Invalid date: ${hijriDateStr}`);
                continue;
            }

            // Check if within range
            if (m.isBetween(startDate, endDate, 'day', '[]')) {
                allHolidays.push({
                    name: def.name,
                    localName: def.localName,
                    date: m.locale('en').format('YYYY-MM-DD'),
                    countryCode: "MA",
                    type: "religious",
                    description: def.description,
                    hijriDate: m.locale('ar-SA').format('iD iMMMM iYYYY'), // Keep Hijri date in Arabic if preferred, or use 'en' if not. The previous output had Arabic which looks nice for display.
                });
            }
        }
    }

    // Sort by date
    allHolidays.sort((a, b) => {
        return moment(a.date).diff(moment(b.date));
    });

    return allHolidays;
};

const main = () => {
    const holidays = generateHolidays();
    const outputPath = path.resolve(process.cwd(), 'src/data/islamic-holidays.json');
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(holidays, null, 2));
    console.log(`Generated ${holidays.length} holidays to ${outputPath}`);
};

main();
