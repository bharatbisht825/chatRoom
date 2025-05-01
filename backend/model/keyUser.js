const mongoose=require("mongoose");
const roomSchema=mongoose.Schema({
    key:{
        type:String,
        required:[true,"Please enter the key"]
    },
    users:{
        type:Array,
        required:[true,"Please enter the users"]
    },
    premium:{
        type:Boolean,
        default:false,
    }
})

module.exports=mongoose.model("room",roomSchema)