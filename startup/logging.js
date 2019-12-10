const winston = require("winston"); //transports (logs) to console / file / http
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  //Captures node env sync exceptions (ie NOT promises)
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  //Captures node env async rejections - throws back to above function
  process.on("unhandledRejection", ex => {
    console.log("UNHANDLED REJECTION");
    throw ex;
  });

  //Error logging - only used in the express context
  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost/vidly",
    level: "error"
  });
};
