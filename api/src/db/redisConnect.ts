import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("REDIS_URL environment variable is not set");
}

const client = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error(" Redis: Too many reconnection attempts");
        return new Error("Too many retries");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

client.on("error", (err) => {
  console.error(" Redis Client Error:", err);
});

client.on("connect", () => {
  console.log("Redis Client connected");
});

client.on("ready", () => {
  console.log(" Redis Client ready");
});

client.on("reconnecting", () => {
  console.log("Redis Client reconnecting...");
});

// Connect with error handling
(async () => {
  try {
    await client.connect();
    console.log(" Redis connected successfully");
  } catch (err) {
    console.error(" Failed to connect to Redis:", err);
    console.error(" Server will continue but OTP functionality will be unavailable");
  }
})();

export const redisClient = client;
