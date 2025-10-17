function ensureTraveler(req, res, next) {
  if (req.session.user && req.session.user.role === "traveler") {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized — Traveler only" });
}

function ensureOwner(req, res, next) {
  if (req.session.user && req.session.user.role === "owner") {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized — Owner only" });
}

module.exports = { ensureTraveler, ensureOwner };