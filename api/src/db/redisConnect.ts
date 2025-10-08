import { createClient } from "redis"

const client = createClient({
  url: process.env.REDIS_URL
});

export const redisClient = client.on("error", function(err) {
  throw err;
});

await client.connect()

// await client.close();