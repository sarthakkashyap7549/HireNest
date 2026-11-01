import dotenv from "dotenv";

dotenv.config();

const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET", "CLIENT_URL"];

export function validateEnvironment() {
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }
  if (!Number.isInteger(Number(process.env.PORT || 5000)) || Number(process.env.PORT || 5000) < 1) {
    throw new Error("PORT must be a positive integer.");
  }
  if (!Number.isInteger(Number(process.env.DB_PORT || 3306)) || Number(process.env.DB_PORT || 3306) < 1) {
    throw new Error("DB_PORT must be a positive integer.");
  }
}

export const env = {
  port: Number(process.env.PORT || 5000),
  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME,
  dbSsl: process.env.DB_SSL === "true",
  dbCaPath: process.env.DB_CA_PATH || "",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientUrls: (process.env.CLIENT_URL || "").split(",").map((url) => url.trim()).filter(Boolean),
};
