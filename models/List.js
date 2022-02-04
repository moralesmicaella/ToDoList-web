const mongoose = require("mongoose");
const { Item, ItemSchema } = require(__dirname + "/Item.js");

const ListSchema = new mongoose.Schema({
  name: String,
  items: [ItemSchema]
});

const ListModel = mongoose.model("List", ListSchema);

const item1 = new Item("Welcome to your todolist!");
const item2 = new Item("Hit the + button to add a new item.");
const item3 = new Item("<-- Hit this to delete an item.");
const defaultItems = [item1, item2, item3];

class List {
  constructor(name) {
    this.list = new ListModel({
      name: name,
      items: defaultItems,
    });

    return this.list;
  }
}

module.exports = {
  ListModel,
  List
}
