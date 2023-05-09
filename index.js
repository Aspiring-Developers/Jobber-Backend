const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => res.send("Welcome!"));

const PORT = 3001
app.listen(PORT, ()=> {
  console.log("app running on port ", PORT)
})