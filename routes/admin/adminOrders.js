const express = require("express");
const router = express.Router();

const Order = require("../../models/orderModel");

//get all users
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get product by id
router.get("/getById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.findById(id);
    if (!orders) {
      return res
        .status(404)
        .json({ message: `Product not found with ID ${id}` });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/updateStatus", async (req, res) => {
  try {
    const { _id, status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      { status: status },
      { new: true }
    );

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to update order status." });
  }
});

module.exports = router;
