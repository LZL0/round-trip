import "dotenv/config";
import { Client } from "pg";
import { performance } from "perf_hooks";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

async function testLatency() {
  const start = performance.now();

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Connect to the database
    await client.connect();
    const connectTime = performance.now();
    console.log(
      `Postgres connection time: ${(connectTime - start).toFixed(2)} ms`
    );

    // First query
    await client.query("SELECT 1");
    const firstQueryTime = performance.now();
    console.log(
      `Postgres first query round-trip: ${(
        firstQueryTime - connectTime
      ).toFixed(2)} ms`
    );

    // Second query
    await client.query("SELECT 1");
    const secondQueryTime = performance.now();
    console.log(
      `Postgres second query time: ${(secondQueryTime - firstQueryTime).toFixed(
        2
      )} ms`
    );
  } catch (err) {
    console.error("Connection/query failed:", err);
  } finally {
    await client.end();
  }
}

testLatency();
