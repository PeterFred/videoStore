const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const Joi = require("Joi");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  //Static method: Available on a class (defined in model) eg) Rental.lookup()
  // Instance method: new User().generateAuthToken() -when working on an object

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("return already processed");

  //Set the rental fee using an instance method (defined in the class)
  rental.return();
  await rental.save();

  //Increase the movie stock by 1
  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

  return res.send(); //nb 200 sent by default
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
