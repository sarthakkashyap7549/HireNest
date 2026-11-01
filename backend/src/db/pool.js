
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "../config/env.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const sslConfig = env.dbSsl
  ? {
      ca: fs.readFileSync(
        env.dbCaPath ||
          path.resolve(currentDir, "../../certs/ca.pem"),
        "utf8"
      ),
      rejectUnauthorized: true,
    }
  : undefined;

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
  ...(sslConfig ? { ssl: sslConfig } : {}),
});

export async function verifyDatabaseConnection() {
  const connection = await pool.getConnection();
  connection.release();
}
