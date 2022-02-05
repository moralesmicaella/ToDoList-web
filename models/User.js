const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const ListManager = require(__dirname + "/List.js");
const List = ListManager.List;

const ItemManager = require(__dirname + "/Item.js");
const Item = ItemManager.Item

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

const configure = function(app) {
  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(User.createStrategy());

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}

const signUp = function(req, res) {
  const newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      res.render("login", {
        error: true,
        errorMessage: err.message
      })
    } else {
      passport.authenticate("local")(req, res, function() {
        const defaultList = new List({
          userID: newUser.id,
          name: "Today",
          items: ItemManager.defaultItems
        });
        defaultList.save()
          .then(() => {
            res.redirect("/")
          });
      });
    }
  });
}

const login = function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      passport.authenticate("local", {
        failureRedirect: "/failed-login"
      })(req, res, function() {
        res.redirect("/");
      });
    }
  })
}

module.exports = {
  UserSchema,
  User,
  configure,
  signUp,
  login
};
