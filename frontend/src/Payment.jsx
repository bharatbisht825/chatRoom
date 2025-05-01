import React, { useState,useEffect } from 'react'

function Payment() {
  // first create an order
  const amount=10
  const [email,setEmail]=useState("")
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
        document.body.removeChild(script);
    };
}, []);

  async function startOrder(){
    const orderPayload={
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({email:email,amount:amount})
  
    }  
  
    const orderRequest=await fetch("http://localhost:3000/createOrder",orderPayload)
    const response=await orderRequest.json();
    const orderId=response.id
    console.log(response)
    if(orderId){          
      var options = {
                "key": "rzp_test_bcpe7o27skE4ao", // Enter the Key ID generated from the Dashboard
                "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Acme Corp", //your business name
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id":orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": async function (response){
                    console.log(response)
                    // verify the signature in backend
                    const signaturePayload={
                      method:'POST',
                      headers:{
                        'Content-Type':"application/json"
                      },
                      body:JSON.stringify({
                        order_id:orderId,
                        razorpay_payment_id:response.razorpay_payment_id,
                        razorpay_order_id:response.razorpay_order_id,
                        razorpay_signature:response.razorpay_signature
                      })
                     
                    }

                    const validateSignature=await fetch("http://localhost:3000/verifyPayments",signaturePayload)
                    const parsedValue=await validateSignature.json()
                    console.log(parsedValue)
                },
                "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                    "name": "Gaurav Kumar", //your customer's name
                    "email": "gaurav.kumar@example.com", 
                    "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
              var rzp1 = new Razorpay(options);
              rzp1.open()}
  }

  
  return (
    <div>Payment
      <input type="text" onChange={(e)=>setEmail(e.target.value)} />
      <button onClick={startOrder}>Click for payment</button>
    </div>
  )
}

export default Payment