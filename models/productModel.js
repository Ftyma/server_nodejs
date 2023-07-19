const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    group_id: {
      type: Number,
      required: true,
    },
    category: [
      {
        type: Number,
        required: true,
      },
    ],
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", productSchema, "products");

module.exports = Product;
