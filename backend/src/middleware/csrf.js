import crypto from "node:crypto"

function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex")
}

export function ensureCsrfToken(req, res, next) {
  if (!req.session) {
    return res.status(500).json({error : "Session not initialized"})
  }

  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  next();
}

export function verifyCsrfToken(req, res, next) {
  const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"]

  if (!protectedMethods.includes(req.method)) {
    return next();
  }

  const sentToken = req.get("X-CSRF-Token");
  const sessionToken = req.session?.csrfToken;
  
  if (!sessionToken || !sentToken) {
    return res.status(403).json({error : "Missing CSRF Token"})
  }

  if (sessionToken !== sentToken) {
    return res.status(403).json({error : "Invalid CSRF Token"})
  }

  return next()
}

export function verifyOrigin(req, res, next) {
  const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"]

  if (!protectedMethods.includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");
  const allowedOrigin = "http://localhost:3000"

  if (!origin || origin !== allowedOrigin) {
    return res.status(403).json({error: "Invalid origin"});
  }

  return next();
}