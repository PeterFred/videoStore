const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");

require("express-async-errors");
const error = require("./middleware/error");

const genres = require("./routes/genre");
const users = require("./routes/user");
const auth = require("./routes/auth");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to Vidly MongoDB..."))
  .catch(err => console.error("Could not connect to mongoDB", err));

app.use(express.json());
app.use("/genres", genres);
app.use("/customers", customers);
app.use("/movies", movies);
app.use("/rentals", rentals);
app.use("/users", users);
app.use("/auth", auth);

//Must go after above
//Collects exceptions, and uses middleware to handle it
app.use(error);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get("/", (req, res) => {
  res.send("Welcome to Vidly");
});
