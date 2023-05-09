const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const userRouter = require("./controllers/UserRouter");
app.use(express.json());

require("./db");

app.get("/", (req, res) => res.send("Welcome!"));
app.use("/api/users", userRouter)

const PORT = 3001;
app.listen(PORT, () => {
  console.log("app running on port ", PORT);
});
