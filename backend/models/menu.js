const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    itemName: {
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
    productType: {
      type: [String],
      enum: [
        "Beef",
        "Pork",
        "Chicken",
        "Milk",
        "Egg",
        "Vegan",
        "Vegetarian",
        "Glutten-Free",
        "Fish",
        "Others",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
