const express = require("express");
const router = express.Router();
const { Customer } = require("../models/customer");
const { Rental } = require("../models/rental");

router.post("/", async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("CustomerId not provided");
  if (!req.body.movieId) return res.status(400).send("MovieId not provided");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  });

  if (!rental) res.status(404).send("No customer found");

  res.status(401).send("Unauthorised");
});

module.exports = router;
