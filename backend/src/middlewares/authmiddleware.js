// ✅ Require Traveler (must be logged in as traveler)
function ensureTraveler(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Please log in to continue" });
  }
  if (req.session.user.role !== "traveler") {
    return res.status(403).json({ message: "Access denied — Traveler only" });
  }
  next();
}

// ✅ Require Owner (must be logged in as owner)
function ensureOwner(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Please log in to continue" });
  }
  if (req.session.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied — Owner only" });
  }
  next();
}

// ✅ Optional: Require any logged-in user
function ensureLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Please log in to continue" });
  }
  next();
}

module.exports = { ensureTraveler, ensureOwner, ensureLoggedIn };
