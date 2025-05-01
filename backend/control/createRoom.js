const { response } = require("express");
const room=require("../model/keyUser")
const premiumUser=require("../model/premiumUser")

async function  createRoom(req,res) {
    // console.log(req.body);

    // create a random room id 4 digit and also check for any records in db
    const count= await room.countDocuments()
    const key=1000+count;
    const users=[]
    const {member,email}=req.body;

    // check if user is premium or not
    const checkPremium= await premiumUser.findOne({key:email})
    if(checkPremium && checkPremium.status){
        // create data in keyUser with room set as premium
        const firstUser=Math.floor(Math.random()*10000)
        for(let i=0;i<member;i++){
            users.push(firstUser+i)
        }
        const databasePush= await room.create({
            key:key,
            users:users,
            premium:true
        })
        if(databasePush){
            res.json({"key":key,"users":users})
            console.log("creating room for premium user"+databasePush)
        }
    }
    else if(member<5){
        // create the data but with premium as false
        const firstUser=Math.floor(Math.random()*10000)
        for(let i=0;i<member;i++){
            users.push(firstUser+i)
        }
        const databasePush= await room.create({
            key:key,
            users:users,
            premium:false
        })
        if(databasePush){
            res.json({"key":key,"users":users})
        }
    }
    else{
        res.json({err:"Not Premium"})
    }
    
    
    //console.log (databasePush)
    
}

module.exports=createRoom