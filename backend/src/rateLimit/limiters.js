import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import { redisClient } from "../config/redis.js";

// Insurance limiter if RedisDB is not available
const insuranceLimiter = new RateLimiterMemory({
  points: 50,
  duration: 1,
});

// Limiters
const globalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:global",
  points: 100, // 100 requests
  duration: 60 * 15, // reset every 15 minutes 
  blockDuration: 60, // block 60 minutes
  useRedisPackage: true,
  rejectIfRedisNotReady: true,
  insuranceLimiter,
  inMemoryBlockOnConsumed: 100,
  inMemoryBlockDuration: 60,
});

const loginFailByIp = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:login_fail:ip",
  points: 10, // 10 tries
  duration: 60 * 15, // reset every 5 minutes
  blockDuration: 60 * 10, // block 10 minutes
  useRedisPackage: true,
  rejectIfRedisNotReady: true,
  insuranceLimiter,
});

const loginFailByEmailAndIp = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:login_fail:email_ip",
  points: 5, // 5 tries
  duration: 60 * 60 * 3, // 3h
  blockDuration: 60 * 10, // 10 mins
  useRedisPackage: true,
  rejectIfRedisNotReady: true,
  insuranceLimiter,
});

const notesWriteLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:notes:write",
  points: 20, // 20 requests
  duration: 60, // reset every minute
  blockDuration: 60, // block 1 minute
  useRedisPackage: true,
  rejectIfRedisNotReady: true,
  insuranceLimiter,
});

export {globalLimiter, loginFailByIp, loginFailByEmailAndIp, notesWriteLimiter}