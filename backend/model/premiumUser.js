const mongoose= require("mongoose")

const premiumSchema=mongoose.Schema({
    key:{
        type:String,
        required:[true,"please provide the email"]
    },
    status:{
        type:Boolean,
        required:[true,"please provide premium status"]
    },
    orderId:{
        type:String,
        required:[true,"please provide order id"]
    }
})

module.exports=mongoose.model("premiumUser",premiumSchema)