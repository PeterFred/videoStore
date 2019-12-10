const express = require("express");
const error = require("../middleware/error");

const genres = require("../routes/genre");
const users = require("../routes/user");
const auth = require("../routes/auth");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");

module.exports = function(app) {
  app.use(express.json());
  app.use("/genres", genres);
  app.use("/customers", customers);
  app.use("/movies", movies);
  app.use("/rentals", rentals);
  app.use("/users", users);
  app.use("/auth", auth);

  app.get("/", (req, res) => {
    res.send("Welcome to VideoStore app");
  });

  //Must go after above
  //Collects exceptions, and uses middleware to handle it
  app.use(error);
};
