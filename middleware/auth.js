const jwt = require("jsonwebtoken");
const config = require("config");

/*  Middleware function to authenticate a user
    Only apply to modules that require authentication.
    Takes a req, readers the token header, verifies the token,
    extracts the payload (_id), and sets to the user
    */

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
