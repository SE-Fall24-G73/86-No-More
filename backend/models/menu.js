const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    restaurentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ItemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
