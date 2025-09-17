import { Pool } from 'pg';

// Create a connection pool
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await db.query(query, params);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Database query error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}