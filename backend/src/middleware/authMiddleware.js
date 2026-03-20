function requireAuth (req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({error:"Unauthorized"})
  };
  next();
}

function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/notes')
  }
  next();
}

export {requireAuth, redirectIfAuthenticated};