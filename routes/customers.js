const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
  //return res.send(await Customer.find().sort("name"));
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.FindById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} was not found`);

  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} was not found`);
  }
  customer.set({ name: req.body.name });
  customer.save();
  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} was not found`);

  res.send(customer);
});

module.exports = router;
