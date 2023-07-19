const express = require("express");
const Cart = require("../../models/cartModel");
const router = express.Router();

const Product = require("../../models/productModel");

//update product by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: `Cannot find any product with ID ${id}` });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//display all products with status=0
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({ status: 1 });
    if (products.length === 0) {
      return res.status(400).json({ message: "no products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//get product by id
router.get("/getById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found with ID ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add a new product
router.post("/add", async (req, res) => {
  try {
    const {
      id,
      product_name,
      sku,
      description,
      price,
      group_id,
      category,
      image,
    } = req.body;
    const product = await Product.create({
      id,
      product_name,
      sku,
      description,
      price,
      group_id,
      category,
      image,
      status: 1,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update product & cart to status=0
router.patch("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateProduct = await Product.updateOne(
      { id: id },
      { $set: { status: 0 } }
    );
    console.log("product", updateProduct);
    const updatedCart = await Cart.updateMany(
      { id: id },
      { $set: { status: 0 } }
    );
    console.log("cart", updatedCart);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update status=0 and push to trash db
// router.patch("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(id, { status: 0 });

//     if (!product) {
//       console.log("Product not found");
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const updatedItem = new Trash({
//       id: product.id,
//       sku: product.sku,
//       product_name: product.product_name,
//       description: product.description,
//       price: product.price,
//       image: product.image,
//       group_id: product.group_id,
//       category: product.category,
//       quantity: product.quantity,
//       status: 0,
//     });

//     await updatedItem.save();
//     res.status(200).json(updatedItem);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.patch("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(id, { status: 0 });

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
