const express = require("express");
const cors=require("cors")
const connectDB=require("./connectDB");
const createRoom=require("./control/createRoom");
const premiumUser=require("./model/premiumUser")
const joinRoom=require("./control/joinRoom");
const emailData=require('./control/emailData')
const createOrder=require('./control/createOrder');
const verifyPayments=require('./control/verifyPayment')
const dotenv=require("dotenv")
const {Server}=require("socket.io")
const http=require("http")
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const envPath = `.env.${env}`;

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`Loaded ${envPath}`);
} else {
  dotenv.config(); // fallback to .env
  console.log('Loaded default .env');
}
console.log('Running in mode:', process.env.MODE);
console.log('API URL is:', process.env.ORIGIN);
connectDB();
const app = express();
// create and http server
const PORT = process.env.PORT || 5000;
const httpServer= http.createServer(app);
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));
httpServer.listen(PORT,()=>{
    console.log("server to socket is connected")
})
const socketio= require("socket.io")(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"]
  }
});

const roomToUser= new Map()
const userToRoom=new Map()
    
// Start the server
socketio.on("connection", (socket) => {
    console.log("new client is connected "+socketio.id)
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
            socket.to(clientSocket).emit("message",{"message":message,"type":"text"})
            console.log("i have  emmited the following message "+message+" to ssocket "+clientSocket+ " the socket i am connectwith is "+socket.id)
        });
    })
    
    socket.on("sendImage",({message,roomId})=>{
        roomToUser.get(roomId.toString()).forEach(clientSocket => {
            socket.to(clientSocket).emit("sendImage",{"message":message,"type":"image"})
            console.log("i have  emmited an image message to ssocket "+clientSocket+ " the socket i am connectwith is "+socket.id)
        });
    })
})


// run express server


app.use(express.json());
app.post("/createRoom",createRoom)
app.post("/joinRoom",joinRoom)
app.post("/emailData",emailData)
app.post("/createOrder",createOrder)
app.post("/verifyPayments",verifyPayments)
