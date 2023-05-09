const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("", async (request, response) => {
  const users = await User.find({});

  return response.status(200).json({ users });
});

router.post("", async (request, response) => {
  const { firstName, lastName, password, email } = request.body;
  

  return response.json({firstName});
});

module.exports = router;
