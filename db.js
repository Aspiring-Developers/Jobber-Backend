const config = require("./utils/config");
const { connect, set } = require("mongoose");

set("strictQuery", false);

connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((e) => console.log("Something occured... ", e));
