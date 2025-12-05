import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.ts";

config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function verify() {
	try {
		console.log("🔍 Verifying seeded holidays...");

		const result = await db.execute(sql`
			SELECT 
				EXTRACT(YEAR FROM date) as year,
				COUNT(*) as count
			FROM holidays 
			WHERE country_code = 'MA'
			GROUP BY year
			ORDER BY year;
		`);

		console.table(result.rows);
	} catch (error) {
		console.error("❌ Error verifying database:", error);
	} finally {
		await pool.end();
	}
}

verify();
