import React from 'react'
import {io} from "socket.io-client"
import './entire.css'

function homePage() {
  const socket = io("http://localhost:3000");
  socket.on('message',(message)=>{
    console.log(message);
  })
  socket.on("connect",()=>{
    socket.emit("message",`i have connected with ${socket.id}`)
    console.log("connected");
  })
  return (
    <div className='homePage'>
        <button onClick={joinRoom}>join room</button>
        <button>create room</button>
    </div>
  )
}


export default homePage