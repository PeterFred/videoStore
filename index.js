const genres = require("./routes/genre");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const customers = require("./routes/customers");
const movies = require("./routes/movies");

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to Vidly MongoDB..."))
  .catch(err => console.error("Could not connect to mongoDB", err));

app.use(express.json());
app.use("/genres", genres);
app.use("/customers", customers);
app.use("/movies", movies);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get("/", (req, res) => {
  res.send("Welcome to Vidly");
});
