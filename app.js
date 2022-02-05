const express = require("express");
const bodyParser = require("body-parser");

const db = require(__dirname + "/db.js");

const ListManager = require(__dirname + "/models/List.js");
const List = ListManager.List;

const UserManager = require(__dirname + "/models/User.js");
const User = UserManager.User;

const app = express();

const port = process.env.PORT || 3000;

db.connect();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

UserManager.configure(app);

app.set("view engine", "ejs");

app.route("/")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      ListManager.showAllLists(req, res);
    } else {
      res.redirect("/login");
    }
  })

  .post((req, res) => {
    ListManager.addNewList(req, res);
  });

app.route("/login")
  .get((req, res) => {
    res.render("login", {
      error: false,
      errorMessage: ""
    });
  })

  .post((req, res) => {
    UserManager.login(req, res);
  });

app.get("/failed-login", (req, res) => {
  res.render("login", {
    error: true,
    errorMessage: "The username or password is incorrect. Please try again"
  });
})

app.post("/signup", (req, res) => {
  UserManager.signUp(req, res);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post("/delete-list", (req, res) => {
  ListManager.deleteList(req, res);
});

app.post("/go-to-list", (req, res) => {
  const list = req.body;
  res.redirect("/" + list.title);
});

app.route("/:listTitle")
  .get((req, res) => {
    ListManager.showSelectedList(req, res);
  })

  .post((req, res) => {
    ListManager.addNewItem(req, res);
  });

app.post("/:listTitle/delete-item", (req, res) => {
  ListManager.deleteItem(req, res);
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
