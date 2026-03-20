export function rateLimitBy(limiter, keySelector) {
  return async function(req, res, next) {
    try {
      const key = keySelector(req)
      const rateLimiterRes = await limiter.consume(key);

      res.set("X-RateLimit-Remaining", String(rateLimiterRes.remainingPoints));
      next();
    } catch (rejRes) {
      if (rejRes instanceof Error) {
        return next(rejRes);
      }
    const retryAfter = Math.max(1, Math.ceil(rejRes.msBeforeNext / 1000));
    res.set(`Retry after ${String(retryAfter)}`)

    return res.status(429).json({error: "Too Many Requests", retryAfter})
    }
  }
}