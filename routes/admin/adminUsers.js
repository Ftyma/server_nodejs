const express = require("express");
const router = express.Router();

const Users = require("../../models/userModel");

//get all users
router.get("/all", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Disable user
router.put("/disable", async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await Users.findOneAndUpdate(
      { uid },
      { disabled: true },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to disable user." });
  }
});

//Enable User
router.put("/enable", async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await Users.findOneAndUpdate(
      { uid },
      { disabled: false },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to enable user." });
  }
});

module.exports = router;
