const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation");
// require("./startup/prod")(app);

const port = process.env.port || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port);
}

if (process.env.NODE_ENV !== "production") {
  require("./startup/prod")(app);
}

const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
