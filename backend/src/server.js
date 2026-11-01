import app from "./app.js";
import { env, validateEnvironment } from "./config/env.js";
import { pool, verifyDatabaseConnection } from "./db/pool.js";

async function start() {
  validateEnvironment();
  await verifyDatabaseConnection();
  app.listen(env.port, () => {
    console.log(`HireNest API listening on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error("Unable to start HireNest API:", error.message);
  pool.end().finally(() => process.exit(1));
});
