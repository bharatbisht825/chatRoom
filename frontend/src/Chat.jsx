import { set } from 'mongoose';
import React, { useEffect, useRef, useState } from 'react'
import {io} from "socket.io-client"
function Chat({roomID,userID}) {
    const [message,setMessage]=useState("")
    const [chats,setChats]=useState([])
    const socketRef= useRef(null);
    useEffect(()=>{
      socketRef.current = io("http://localhost:3000");
        socketRef.current.on("connect",()=>{
            //console.log("the client is connected with socket id"+socketRef.current.id)
            socketRef.current.emit("conMessage",{"message":"new message","roomId":roomID})
            //console.log("i have send the message")
        })
        socketRef.current.on("message",(message)=>{
          
          setChats((prevState)=>[...prevState,{"sender":"other","text":message.message}])
        })  
        return ()=>{
          socketRef.current.disconnect()
        }
    },[])
        //  connect to the websocket
      function sendMessage(){
          if(socketRef.current.connected){
            socketRef.current.emit("message",{"message":message,"roomId":roomID})
            setChats((prevState)=>[...prevState,{"sender":"self","text":message}])
          }
      }
      useEffect(()=>console.log("this is from chats state"+chats),[chats])

  return (
    <div>
      <div className="chatBox" style={{"display":"flex","flexDirection":"column"}} >
            {chats.map((val,ind,array)=>{
              if(val.sender=="self"){
                return(<p style={{"display":"flex","justifyContent":'flex-end'}}>{val.text}</p>)
              }
              else{
                return(<p style={{"display":"flex","justifyContent":'flex-start'}}>{val.text}</p>)
              }

            })}
      </div>
      <input type="text" onChange={(event)=>setMessage(event.target.value)} placeholder='please enter your message'/ >
      <button onClick={sendMessage}>send message</button>
    </div>
  )
}

export default Chat
