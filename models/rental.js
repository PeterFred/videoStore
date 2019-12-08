const Joi = require("Joi");
const mongoose = require("mongoose");
const { movieSchema } = require("./movies");

//Persistance model - whats stored in the DB
const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    //Create a lightweight customer / movie schema - can ref _id if needed
    customer: {
      type: new mongoose.schema({
        name: { type: String, required: true, minlength: 5, maxlength: 50 },
        isGold: { type: Boolean, default: false },
        phone: { type: String, required: true, minlength: 5, maxlength: 50 }
      }),
      required: true
    },
    movie: {
      type: new mongoose.schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 50
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255
        }
      }),
      required: true
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now
    },
    dateReturned: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
    }
  })
);

//Joi schema is what the client sends us
function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };
  return Joi.validate(rental, schema);
}

exports.Movie = Movie;
exports.validate = validateRental;