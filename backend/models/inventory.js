const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  restname: {
    type: String,
    required: true,
  },
  itemname: {
    type: String,
    required: true,
  },
  metric: {
    type: String,
    required: true,
  },
  restid:{
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
    type: String,
    required: true,
  },
  dateexpired: {
    type: String,
    required: true,
  }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
