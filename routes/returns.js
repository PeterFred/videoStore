const express = require("express");
const router = express.Router();
const { Customer } = require("../models/customer");
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("CustomerId not provided");
  if (!req.body.movieId) return res.status(400).send("MovieId not provided");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  });

  if (!rental) res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("return already processed");

  rental.dateReturned = new Date();
  await rental.save();

  return res.status(200).send();
});

module.exports = router;
