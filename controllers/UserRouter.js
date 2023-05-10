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
  const salt = bcrypt.genSaltSync(10);
  if (!password) {
    return response
      .status(400)
      .json({ message: "Password field cannot be empty" });
  }
  const passwordHash = await bcrypt.hashSync(password, salt);

  const newUser = {
    firstName,
    lastName,
    passwordHash,
    email,
  };

  const user = new User(newUser);
  try {
    await user.save();
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }

  return response.status(201).json(user).end();
});

module.exports = router;
