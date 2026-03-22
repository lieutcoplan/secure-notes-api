function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.session?.role;
    if (!role) return res.status(401).json({error: "Unauthorized"});

    if (!allowedRoles.includes(role)) {
      req.log.warn({
        ip: req.ip,
    }, "Attempt to access admin area");
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

export {requireRole}