import { sql } from "drizzle-orm";
import { db } from "../db";

async function checkSchema() {
	try {
		console.log("Checking tables...");
		const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
		console.log(
			"Tables:",
			tables.rows.map((r: any) => r.table_name),
		);

		console.log("\nChecking enums...");
		const enums = await db.execute(sql`
      SELECT t.typname, e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
    `);
		console.log("Enums:", enums.rows);

		console.log("\nChecking events table columns...");
		const columns = await db.execute(sql`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'events'
    `);
		console.log(
			"Events Columns:",
			columns.rows.map((r: any) => `${r.column_name} (${r.udt_name})`),
		);
	} catch (error) {
		console.error("Error checking schema:", error);
	}
	process.exit(0);
}

checkSchema();
