//Simple try/block handler for routes
//Returns an async route handler function for express to call
//To use wrap all endpoints in asyncMiddleware eg:
// const asyncMiddleware = require("../middleware/async");

// router.get(
//   "/",
//   asyncMiddleware(async (req, res, next) => {
//     const genres = await Genre.find().sort("name");
//     res.send(genres);
//   })
// );

//REPLACED WITH require("express-async-errors");

module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
