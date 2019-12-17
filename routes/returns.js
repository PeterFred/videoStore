const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");
const moment = require("moment");

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

  //Set the rental fee
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  //Increase the movie stock by 1
  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

  return res.status(200).send();
});

module.exports = router;
