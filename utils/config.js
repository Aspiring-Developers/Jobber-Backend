require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

module.export = {
  MONGODB_URI,
};
