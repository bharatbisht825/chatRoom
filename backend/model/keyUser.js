const mongoose=require("mongoose");
const roomSchema=mongoose.Schema({
    key:{
        type:String,
        required:[true,"Please enter the key"]
    },
    users:{
        type:Array,
        required:[true,"Please enter the users"]
    }
})

module.exports=mongoose.model("room",roomSchema)