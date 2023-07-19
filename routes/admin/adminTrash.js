const express = require("express");
const Cart = require("../../models/cartModel");
const router = express.Router();

const Product = require("../../models/productModel");

//get all products
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({ status: 0 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/recover/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateProduct = await Product.updateOne(
      { id: id },
      { $set: { status: 1 } }
    );
    console.log("product", updateProduct);
    const updatedCart = await Cart.updateMany(
      { id: id },
      { $set: { status: 1 } }
    );
    console.log("cart", updatedCart);
    res.status(200).json({ message: "Product recovered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//recover
// router.patch("/recover/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(id, { status: 1 });

//     if (!product) {
//       console.log("Product not found");
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
