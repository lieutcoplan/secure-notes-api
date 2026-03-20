import { createClient } from 'redis';

export const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 100, 1000),
    },
    disableOfflineQueue: true,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));


export async function connectRedis() {
  await redisClient.connect();
  console.log("✅ Redis connected")
}
