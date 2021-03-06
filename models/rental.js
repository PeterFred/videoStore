const Joi = require("Joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  //Create a lightweight customer / movie schema - can ref _id if needed
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 5, maxlength: 50 },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true, minlength: 5, maxlength: 50 }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
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
});

//Static method on the class
rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId
  });
};

//Instance method
rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

//Persistance model - whats stored in the DB
const Rental = mongoose.model("Rental", rentalSchema);

//Joi schema is what the client sends us
function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(), //objectId - joi-objectId validation method
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
