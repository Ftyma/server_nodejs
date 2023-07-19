const express = require("express");
const router = express.Router();
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");

// Get all carts
router.get("/get-carts", async (req, res) => {
  const uid = req.query.uid;

  try {
    const carts = await Cart.find({ uid: uid, status: 1 });
    const cartIds = carts.map((cart) => cart.id); //get Id of item in carts
    const products = await Product.find({ id: { $in: cartIds } });

    const filterCart = carts.filter((cart) => {
      return products.some((product) => product.id === cart.id);
    });
    res.status(200).json(filterCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id);
    if (!cart) {
      return res
        .status(404)
        .json({ message: `Product not found with ID ${id}` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new cart or update the existing cart item
router.post("/add-carts", async (req, res) => {
  const productId = req.body.id;
  const quantityChange = req.body.quantity;

  try {
    const cartItem = await Cart.findOne({ id: productId, uid: req.body.uid });

    if (cartItem) {
      // Cart item exists, update the quantity
      cartItem.quantity += quantityChange;
      await cartItem.save();
      res.json({ message: "Quantity updated successfully!" });
    } else {
      // Cart item doesn't exist, create a new one
      const newCartItem = new Cart({
        id: productId,
        quantity: quantityChange,
        uid: req.body.uid,
        product_name: req.body.product_name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        status: req.body.status,
      });
      await newCartItem.save();
      res.status(200).json(newCartItem);
      // res.json({ message: "Product added to cart!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create a new cart
// router.post("/add-carts", async (req, res) => {
//   const productId = req.body.id;
//   const quantityChange = req.body.quantity;

//   const updateObject = {
//     $inc: { quantity: quantityChange },
//     $set: {
//       sku: req.body.sku,
//       product_name: req.body.product_name,
//       description: req.body.description,
//       price: req.body.price,
//       image: req.body.image,
//       group_id: req.body.group_id,
//       category: req.body.category,
//     },
//   };

//   try {
//     const updatedCartItems = await Cart.findOneAndUpdate(
//       { id: productId },
//       updateObject,
//       { upsert: true, new: true }
//     );

//     if (updatedCartItems) {
//       console.log(updatedCartItems);
//       res.json({ message: "Quantity updated successfully!" });
//     } else {
//       res.json({ message: "Product added to cart!" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.delete("/delete-carts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      return res
        .status(400)
        .json({ message: `can't find any product with ID ${id}` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!cart) {
      return res.status(404).json({ message: `Cart not found with ID ${id}` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-cart", async (req, res) => {
  try {
    const updatedItems = req.body;

    // Assuming the updatedItems is an array of cart items with id and quantity properties
    // Loop through the updatedItems array and update each cart item in the database
    for (const updatedItem of updatedItems) {
      const { id, quantity } = updatedItem;

      // Find the cart item by id and update its quantity
      await Cart.findOneAndUpdate(
        { id: id },
        { quantity: quantity },
        { new: true }
      );
    }

    // Fetch the updated cart items from the database and send them back as the response
    const updatedCartItems = await Cart.find();
    res.json(updatedCartItems);
  } catch (error) {
    console.error("Error updating cart items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
