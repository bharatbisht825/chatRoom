const express = require("express");
const cors=require("cors")
const connectDB=require("./connectDB");
const createRoom=require("./control/createRoom");
const joinRoom=require("./control/joinRoom");
const emailData=require('./control/emailData')
require("dotenv").config();
const {Server}=require("socket.io")
const http=require("http")
connectDB();
const app = express();
// create and http server
const PORT = process.env.PORT || 5000;
const httpServer= http.createServer(app);
httpServer.listen(PORT,()=>{
    console.log("server to socket is connected")
})
const socketio=new Server(httpServer,{
    cors:{
        origin:"https://chat-m5a80kffr-bharats-projects-d3c8235b.vercel.app",
    }
}
)


const roomToUser= new Map()
const userToRoom=new Map()
    
// Start the server
socketio.on("connection", (socket) => {
    socket.emit("message","this is from socket.emit")
    socket.on("conMessage",({message,roomId})=>{
        console.log(roomId)
        if(roomId)
       { if(roomToUser.get(roomId.toString())){
            roomToUser.get(roomId.toString()).push(socket.id)  
            console.log("inserted socket "+socket.id+" into the array "+roomToUser.get(roomId.toString()))
            //console.log("inserted"+roomToUser.get(roomId.toString()))
        }
        else{
            roomToUser.set(roomId.toString(),[socket.id])
        }
        userToRoom.set(socket.id,roomId)
        //console.log("this socket "+socket.id+ "is connected to that particular room "+userToRoom.get(socket.id))
    }
    
    })
    // logic if the socket disconnects
    socket.on("disconnect",()=>{
        console.log("this socket is disconnected " + socket.id);
    
        const rId = userToRoom.get(socket.id); // No need for `.toString()` yet
        if (!rId) {
            console.log(`No room found for socket ${socket.id}`);
            return; // Stop execution if rId is null or undefined
        }

        roomToUser.set(rId.toString(), roomToUser.get(rId.toString())?.filter(value => value !== socket.id) || []);
        
        userToRoom.delete(socket.id);
        
    })
    
    
    
    socket.on("message",({message,roomId})=>{
        roomToUser.get(roomId.toString()).forEach(clientSocket => {
            socket.to(clientSocket).emit("message",{"message":message})
            console.log("i have  emmited the following message "+message+" to ssocket "+clientSocket+ " the socket i am connectwith is "+socket.id)
        });
    })
})


// run express server


app.use(cors());
app.use(express.json());
app.post("/createRoom",createRoom)
app.post("/joinRoom",joinRoom)
app.post("/emailData",emailData)
