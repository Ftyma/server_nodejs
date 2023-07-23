const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

//Admin Routes
const adminProductRouter = require("./routes/admin/adminProducts");
const adminTrashRouter = require("./routes/admin/adminTrash");
const adminUserRouter = require("./routes/admin/adminUsers");
const adminOrderRouter = require("./routes/admin/adminOrders");
const adminCartRouter = require("./routes/admin/adminCart");

app.use("/adminProducts", adminProductRouter);
app.use("/adminTrash", adminTrashRouter);
app.use("/adminUsers", adminUserRouter);
app.use("/adminOrders", adminOrderRouter);
app.use("/adminCart", adminCartRouter);

//user routes
const clientUsersRouter = require("./routes/client/clientUsers");
const clientCartsRouter = require("./routes/client/clientCarts");
const clientProductsRouter = require("./routes/client/clientProduct");
const clientOrdersRouter = require("./routes/client/clientOrders");

app.use("/userUsers", clientUsersRouter);
app.use("/userCarts", clientCartsRouter);
app.use("/userProducts", clientProductsRouter);
app.use("/userOrders", clientOrdersRouter);

const port = process.env.PORT || 8000;

app.get("/", async (req, res) => {
  res.json("helo");
});
mongoose
  .connect(
    "mongodb+srv://admin:admin12345@cluster0.avq7kyp.mongodb.net/Thaibev?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to mongo");
    app.listen(port, () => {
      console.log(`Node running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("error connected to mongo", error);
  });
