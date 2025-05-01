const razorpay=require("razorpay")
const premium=require('../model/premiumUser');

async function createOrder(req,res){
    const {email,amount}=req.body;
    const instance=new razorpay({key_id:process.env.KEY_ID,key_secret:process.env.KEY_SECRET})
    console.log(req.body)
    const options = {
        amount: amount * 100, // Convert to paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
  
      // Create an order with Razorpay
      const order = await instance.orders.create(options);
      if(order){
        const createdOrder=await premium.create({
          key:email,
          status:false,
          orderId:order.id
        })
        console.log("created order for "+ email +" with order id "+ createdOrder)
      }

      res.status(200).json(order); // Send order details to fronten
    
}

module.exports=createOrder