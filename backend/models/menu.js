const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  restname: {
    type: String,
    required: true,
  },
  menuname: {
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
  costmenu: {
    type: Number,
    required: true,
  },
  
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
