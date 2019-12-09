const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  //Set private key in console: > set vidly_jwtPrivateKey=mySecureKey
  //Parameter stored in custom-enviornment-variables.json
  const token = jwt.sign(
    {
      _id: user._id
    },
    config.get("jwtPrivateKey")
  );

  res.send(token); //return a JSON web token (JWT)
});

function validateAuth(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
