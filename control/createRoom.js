const room=require("../model/keyUser")

async function  createRoom(req,res) {
    // console.log(req.body);

    // create a random room id 4 digit and also check for any records in db
    const count= await room.countDocuments()
    const key=1000+count;
    const users=[]
    const members=req.body.member;
    const firstUser=Math.floor(Math.random()*10000)
    for(let i=0;i<members;i++){
        users.push(firstUser+i)
    }
    const databasePush= await room.create({
        key:key,
        users:users
    })
    if(databasePush){
        res.json({"key":key,"users":users})
    }
    //console.log (databasePush)
    
}

module.exports=createRoom