const express = require("express")
const bodyParser = require("body-parser")
const db = require(__dirname + "/db.js")
const { Item, ItemModel } = require(__dirname + "/models/Item.js")
const { List, ListModel } = require(__dirname + "/models/List.js")

const app = express()

const port = process.env.PORT || 3000

db.connect();

let todoLists = []
let items = []

ListModel.find()
.then((lists) => {
  if (lists.length === 0) {
    const defaultList = new List("Today");
    defaultList.save()
  }
})

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}))

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  ListModel.find()
  .then((lists) => {
    todoLists = [];
    lists.forEach((list) => {
      todoLists.push(list);
    })
  })
  .then(() => {
    res.render("home", {todoLists: todoLists})
  })
})

app.post("/add-list", (req, res) => {
  const list = new List(req.body.listName)
  list.save()
  .then(() => {
    res.redirect("/")
  })
});

app.post("/delete-list", (req, res) => {
  const listID = req.body.button
  ListModel.findByIdAndRemove(listID)
  .then(() => {
    res.redirect("/")
  })
})

app.post("/go-to-list", (req, res) => {
  const list = req.body
  res.redirect("/" + list.title)
})

app.get("/:listTitle", (req, res) => {
  const title = req.params.listTitle
  ListModel.findOne({name: title})
  .then((list) => {
    res.render("list", {list: list})
  })
})

app.post("/:listTitle/add-item", (req, res) => {
  const listID = req.body.listID
  const itemName = req.body.itemName
  ListModel.findByIdAndUpdate(listID, {$push: {items: new Item(itemName)}})
  .then(() => {
    res.redirect("/" + req.params.listTitle)
  })
})

app.post("/:listTitle/delete-item", (req, res) => {
  const listID = req.body.listID
  const itemID = req.body.itemID

  ListModel.findByIdAndUpdate(listID, {$pull: {items: {_id: itemID}}})
  .then(() => {
    res.redirect("/" + req.params.listTitle)
  })
})

app.listen(port, () => {
  console.log("Server started on port " + port)
})
