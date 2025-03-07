const room=require("../model/keyUser")

async function  joinRoom(req,res) {
    const key= req.body.roomId;
    const userId= req.body.userId;
    //console.log(roomKey)
    const dbFetch= await room.findOne({key});
    if(dbFetch.users.includes(userId)){
        res.json({
            "message":"Verified"
        })
    }
    console.log(key)
    console.log(dbFetch)
}
module.exports=joinRoom