const mongoose = require("mongoose");

const ItemManager = require(__dirname + "/Item.js");
const Item = ItemManager.Item

const ListSchema = new mongoose.Schema({
  userID: String,
  name: String,
  items: [ItemManager.ItemSchema]
});

const List = mongoose.model("List", ListSchema);

let todoLists = [];

const showAllLists = function(req, res) {
  List.find({userID: req.user.id}, (err, lists) => {
    if (err) {
      console.log(err.message);
    } else {
      todoLists = [];
      lists.forEach((list) => {
        todoLists.push(list);
      });

      res.render("home", {todoLists: todoLists});
    }
  })
};

const addNewList = function(req, res) {
  const list = new List({
    userID: req.user.id,
    name: req.body.listName,
    items: []
  });
  list.save((err) => {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect("/");
    }
  });
};

const deleteList = function(req, res) {
  const listID = req.body.button;
  List.findOneAndDelete({_id: listID}, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect("/");
    }
  });
};

const showSelectedList = function(req, res) {
  const title = req.params.listTitle;

  List.findOne({userID: req.user.id, name: title}, (err, list) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("list", {
        list: list
      });
    }
  });
};

const addNewItem = function(req, res) {
  const listID = req.body.listID;
  const newItem = new Item({name: req.body.itemName});
  List.findByIdAndUpdate(listID, {$push: {items: newItem}}, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect("/" + req.params.listTitle);
    }
  });
};

const deleteItem = function(req, res){
  const listID = req.body.listID;
  const itemID = req.body.itemID;

  List.findByIdAndUpdate(listID, {$pull: {items: {_id: itemID}}}, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect("/" + req.params.listTitle);
    }
  });
};

module.exports = {
  ListSchema,
  List,
  showAllLists,
  addNewList,
  deleteList,
  showSelectedList,
  addNewItem,
  deleteItem
};
