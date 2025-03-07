const mongoose = require("mongoose");

function connectDB(){
    mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
        console.log("connected to db");
    })
}
module.exports = connectDB;