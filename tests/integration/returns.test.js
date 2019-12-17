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

const request = require("supertest");
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");
const moment = require("moment");

describe("/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  //############################################
  // Define the happy path, and then in each test, we change
  // one parameter that clearly aligns with the name of the test.

  const exec = () => {
    return request(server)
      .post("/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  //########################
  //Set up before / after each test

  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10
    });
    await movie.save();

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
    await Movie.remove({});
  });

  //##################################################

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer / movie", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if we have a valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set the returnDate if input is valid", async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned; //diff in ms
    expect(diff).toBeLessThan(10 * 1000); //10 sec
  });

  it("should calculate the rental fee if input is valid", async () => {
    //Use npm moment to convert Date() to 7 days ago
    rental.dateOut = moment()
      .add(-7, "days")
      .toDate();
    await rental.save();
    await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toEqual(14);
  });

  it("should increase the stock by 1 if input is valid", async () => {
    await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toEqual(movie.numberInStock + 1);
  });

  it("should return the rental if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb).toHaveProperty("dateOut");
    expect(rentalInDb).toHaveProperty("dateReturned");
    expect(rentalInDb).toHaveProperty("rentalFee");
    expect(rentalInDb).toHaveProperty("customer");
    expect(rentalInDb).toHaveProperty("movie");
    // expect(Object.keys(rentalInDbres.body)).toEqual(
    //   expect.arrayContaining([
    //     "dateOut",
    //     "dateReturned",
    //     "rentalFee",
    //     "customer",
    //     "movie"
    //   ])
    // );
  });
});
