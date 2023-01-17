const { getProductsService, createProductService } = require("../services/product.services")

exports.getProducts = async (req, res, next) => {
    try{
  
      const products = await getProductsService();
  
      res.status(200).json({
        status: "success",
        data: products
      })
    }
    catch(error){
      res.status(400).json({
        status: "fail",
        message: "Can't get the data",
        error: error.message,
      })
    }
  }

  //post
  exports.createProduct = async (req, res, next) => {

    try {
  
      const result = await createProductService(req.body)
  
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
  
  }