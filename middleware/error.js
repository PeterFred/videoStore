const winston = require("winston");

//level of error
//error
//warn
//info
//verbose
//debug
//silly

module.exports = function(err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).send("Something failed in express (not startup). Check logs");
};
