const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const auth = require("../middleware/auth");

const bcrypt = require("bcrypt");

//Don't use :id as a param as it can be maliciously inserted
//End point returns user info
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send();
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  //Use lodash.pick to select props without creating new object
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token) //Send custom headers prefixed with x-{name}-token
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
