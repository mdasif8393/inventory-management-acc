//SCHEMA --> MODEL --> QUERY

const mongoose  = require("mongoose");

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

  module. exports = Product;