//Assume this is executed after auth function
module.exports = function(req, res, next) {
  //401 - unauthorised - no valid JWT
  //403 - forbiddin - valid JWT, but still no access
  if (!req.user.isAdmin) return res.status(403).send("Access denied");
  next();
};
