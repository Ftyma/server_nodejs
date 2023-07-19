const express = require("express");
const router = express.Router();

const Cart = require("../../models/cartModel");

router.get("/all", async (req, res) => {
  try {
    const carts = await Cart.find({ status: 1 });
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get cart by uid
router.get("/getByUser/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const cart = await Cart.find({ uid, status: 1 });
    if (!cart) {
      return res
        .status(404)
        .json({ message: `Cart not found with user ${uid}` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
