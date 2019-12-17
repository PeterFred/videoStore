//POST / returns {customerId, movieId}

//Return 401 if client is not logged in
//Return 400 if customerId is not provided
//Return 400 if movieId is not provided
//Return 404 if no rental for this customer / movie
//Return 400 if rental already processed
//Return 200 if valid request
//Set the return date
//Set the rental fee
//Increase the stock
//Return the rental
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
describe("/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345"
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  it("should work!", async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });
});
