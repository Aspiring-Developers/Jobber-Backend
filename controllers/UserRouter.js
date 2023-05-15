const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mailer = require("../utils/mailer");
const successMail = require("../utils/successMail");

router.get("", async (request, response) => {
  const users = await User.find({});

  return response.status(200).json({ users });
});

router.post("", async (request, response) => {
  const { firstName, lastName, password, email } = request.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return response
      .status(422)
      .json({
        error: "Details of user already exists",
      })
      .end();
  }
  const confirmationCode = Math.floor(Math.random() * 500000) + 100000;

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
    confirmationCode,
  };

  const user = new User(newUser);
  try {
    await user.save();
    await mailer(firstName, email, confirmationCode);
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }

  return response.status(201).json(user).end();
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email });

  if (!user) {
    return response
      .status(404)
      .json({
        error: `user with email ${email} doesn't
    exist`,
      })
      .end();
  }
  if (user?.regStatus === "inactive") {
    return response
      .status(403)
      .json({
        error: "User is yet to verify their account.",
      })
      .end();
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return response.status(401).json({
      error: "Invalid email/password",
    });
  }
  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.SECRET);
  return response.status(200).json({ token });
});

router.post("/confirmReg", async (request, response) => {
  const { email, receivedCode } = request.body;
  const user = await User.findOne({ email });

  if (user.regStatus === "active") {
    return response
      .status(404)
      .json({
        error: `You're already a verified user. Please, proceed to login`,
      })
      .end();
  }

  if (!user) {
    return response
      .status(404)
      .json({
        error: `user with email ${email} doesn't
    exist`,
      })
      .end();
  }
  const { confirmationCode } = user;
  if (confirmationCode === receivedCode) {
    user.regStatus = "active";
    await user.save();
    await successMail(user.firstName, email);
    return response.status(200).json({
      message: "User registered successfully.",
    });
  }

  return response
    .status(400)
    .json({ error: "Invalid code or code has expired!" })
    .end();
});

router.patch("/:userId", async (request, response) => {
  const body = request.body;
  const userId = request.params.userId;

  const updates = {}

  Object.keys(body)
    .filter((f) => body[f] !== "")
    .forEach((f) => (updates[f] = body[f]));

  if (Object.keys(updates).includes("membership")) {
    return response.status(403).json({
      error: "You have no permission to do so.",
    });
  }
  try {
    const user = await User.findByIdAndUpdate(userId, updates);
  } catch (e) {
    console.log(error.message);
  }
  return response.json({ message: "Update successful" });
});

module.exports = router;
