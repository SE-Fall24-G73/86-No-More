const mongoose = require("mongoose");

const inventoryhistorySchema = new mongoose.Schema({
  itemname: {
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
  }
});

const Inventoryhistory = mongoose.model("Inventoryhistory", inventoryhistorySchema);

module.exports = Inventoryhistory;
