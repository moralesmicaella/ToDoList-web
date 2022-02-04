const mongoose = require("mongoose");

exports.connect = () => {
  // const uri = "mongodb://localhost:27017/todolistDB"
  const uri = "mongodb+srv://cluster0.bk9na.mongodb.net/todolistDB"
  const options = {
    user: process.env.USER,
    pass: process.env.PASS,
    authSource: "admin"
  };

  mongoose.connect(uri, options);
  console.log("Connected successfully to database");
};
