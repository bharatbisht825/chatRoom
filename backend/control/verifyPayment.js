const razorpay= require("razorpay")
const crypto =require("crypto")
const premium=require('../model/premiumUser');


async function verifyPayments(req,res){
    const {order_id,razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    console.log(req.body)
    const generatedSignature= crypto.createHmac("sha256",process.env.KEY_SECRET).update(order_id+"|"+razorpay_payment_id).digest("hex");
    if(generatedSignature==razorpay_signature){
        res.status(200).json({message:"payment verified sucessfully"})
        const premiumObj=await premium.findOne({orderId:order_id})
        if(premiumObj){
            premiumObj.status=true;
            premiumObj.save()
        }
        console.log("verified payment for order"+premiumObj)

    }
    else{
        res.status(400).json({message:"payment denied"})
    }
}

module.exports=verifyPayments;