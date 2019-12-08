const { Genre, validate } = require("../models/movie");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
  //return res.send(await Genre.find().sort("name"));
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.FindById(req.params.id);

  if (!genre)
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);

  res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name
  });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  }
  genre.set({ name: req.body.name });
  genre.save();
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);

  res.send(genre);
});

module.exports = router;