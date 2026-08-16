require("dotenv").config();
const mongoose = require("mongoose");
const adminModel = require("./Models/Admin");

mongoose.connect(process.env.MONGODB_URL).then(async () => {
    const admin = await adminModel.find({});
    console.log("Admins in DB:", admin);
    process.exit(0);
});
