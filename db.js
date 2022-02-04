require("dotenv").config();
const mongoose = require("mongoose");

exports.connect = () => {
  const uri = "mongodb+srv://cluster0.bk9na.mongodb.net/todolistDB"
  const options = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    authSource: "admin"
  };

  mongoose.connect(uri, options);
  console.log("Connected successfully to database");
};
