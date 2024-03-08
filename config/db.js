const mongoose = require("mongoose");
require("dotenv").config({ path: "var.env" });

const BDConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO);
    console.log("DB CONECTADA");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = BDConnection;
