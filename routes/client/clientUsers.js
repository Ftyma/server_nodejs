const express = require("express");
const router = express.Router();
const Users = require("../../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../config/jwtToken");

router.post("/signup", async (req, res) => {
  const { uid, username, email, password } = req.body;

  try {
    //check existing users
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email already registered. Please login." });
    }

    //hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await Users.create({
      uid,
      username,
      email,
      password: hashedPassword,
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//sign-in route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user email exist
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    //check password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      uid: user?.uid,
      username: user?.username,
      email: user?.email,
      password: user?.password,
      token: generateToken(user?._id),
      message: "Login success",
    });
  } catch (error) {
    console.error("sign in error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//sign-out

router.get("/getById", async (req, res) => {
  const uid = req.query.uid;
  Users.find({ uid: uid })
    .then((orders) => res.json(orders))
    .catch((err) => {
      console.log("Error:", err);
      res.status(400).json("Error fetching order");
    });
});

///get all user
router.get("/getAll", async (req, res) => {
  try {
    const user = await Users.find();
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Product not found with ID ${id}` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete a user
router.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findByIdAndDelete(id);
    return res.status(200).json({ message: "user delete success" });
  } catch (error) {
    console.error("sign in error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//update a user
router.put("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateUser = await Users.findByIdAndUpdate(
      id,
      {
        username: req?.body?.username,
        email: req?.body?.email,
        password: req?.body?.password,
        role: req?.body?.role,
      },
      {
        new: true,
      }
    );
    if (!updateUser) {
      return res.status(404).json({ message: `user not found with ID ${id}` });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
