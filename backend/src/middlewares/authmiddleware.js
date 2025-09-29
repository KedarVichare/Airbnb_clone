app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function ensureTraveler(req, res, next) {
  if (req.session.user && req.session.user.role === "traveler") {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

module.exports = { ensureTraveler };