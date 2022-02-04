const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String
});
const ItemModel = mongoose.model("Item", ItemSchema);

class Item {
  constructor(name) {
    this.item = new ItemModel({
      name: name
    });

    return this.item;
  }
}

module.exports = {
  ItemSchema,
  ItemModel,
  Item
}
