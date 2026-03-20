import crypto from "node:crypto"

// Generate CSRF Token
function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex")
}

function ensureCsrfToken(req, res, next) {
  if (!req.session) {
    return res.status(500).json({error : "Session not initialized"})
  }

  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  next();
}

// Verify CSRF Token
function verifyCsrfToken(req, res, next) {
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

// Verify origin of request
function verifyOrigin(req, res, next) {
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

export {ensureCsrfToken, verifyCsrfToken, verifyOrigin}