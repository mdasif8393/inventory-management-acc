const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const productRoute = require("./routes/product.route");

//middleware
app.use(express.json());
app.use(cors());




app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

//routes
app.use("/api/v1/product", productRoute)


module.exports = app;
