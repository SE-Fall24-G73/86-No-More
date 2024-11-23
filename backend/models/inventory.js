// models/Inventory.js

const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    metric: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    costperitem: {
      type: Number,
      required: true,
    },
    datebought: {
      type: Date,
      required: true,
    },
    dateexpired: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
