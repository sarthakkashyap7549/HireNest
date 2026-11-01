import mysql from "mysql2/promise";
import { env } from "../config/env.js";

// mysql2's pool keeps database access separate from HTTP route handling.
export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z",
  ...(env.dbSsl ? { ssl: {} } : {}),
});

export async function verifyDatabaseConnection() {
  const connection = await pool.getConnection();
  connection.release();
}
