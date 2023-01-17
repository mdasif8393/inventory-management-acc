const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

//middleware
app.use(express.json());
app.use(cors());

//SCHEMA --> MODEL --> QUERY
//schema design
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this product"],
    trim: true, //Remove space from name
    unique: [true, "Name must be unique"], // name unique
    minLength: [3, "Name must be at least 3 characters."],
    maxLength: [100, "Name is too large"],
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price can't be negative"]
  },
  unit: {
    type: String,
    required: true,
    enum: {
      values: ["kg", "litre", "pcs"],
      messages: ["unit value can't be {VALUE}, must be kg/litre/pcs"]
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity cant be negative"],
    validate: {
      validator: (value) => {
        const isInteger = Number.isInteger(value);
        if (isInteger) {
          return true
        }
        else {
          return false
        }
      }
    },
    message: "Quantity must be an integer"
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["in-stock", "out-of-stock", "discontinued"],
      message: ["Status cant be {VALUE}"]
    }
  },
  // supplier:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Supplier"
  // },
  // categories: [{
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   _id: mongoose.Schema.Types.ObjectId
  // }]

}, {
  timestamps: true
})

//Mongoose middleware for saving data: pre / post
productSchema.pre("save", function (next) {

  if (this.quantity == 0) {
    this.status = "out-of-stock"
  }

  next();
})

// productSchema.post("save", function (doc, next) {
//   console.log("After saving data");

//   next();
// })

//instance method
productSchema.methods.logger = function (){
  console.log(`Data saved for ${this.name}`);
}


//Create Model
const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

//posting to database

app.post("/api/v1/product", async (req, res, next) => {

  try {
    //save
    // const product = new Product(req.body);

    // if(product.quantity == 0){
    //   product.status = "out-of-stock"
    // }

    // const result = await product.save();

    //create
    const result = await Product.create(req.body);

    result.logger();

    res.status(200).json({
      status: "success",
      message: "Data inserted successfully!",
      data: result
    })
  }
  catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Data is not inserted",
      error: error.message
    })
  }

})

app.get("/api/v1/product", async (req, res, next) => {
  try{
    // const products = await Product
    // .where("name").equals(/\w/)
    // .where("quantity").gt(100).lt(600)
    // .limit(2).sort({quantity: -1})

    const product = await Product.findById("63c54e06b34ecfff469558e5")

    res.status(200).json({
      status: "success",
      data: product
    })
  }
  catch(error){
    res.status(400).json({
      status: "fail",
      message: "Can't get the data",
      error: error.message,
    })
  }
})

module.exports = app;
