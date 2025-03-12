import React, { useEffect, useRef, useState } from 'react'
import {io} from "socket.io-client"
function Chat({roomID,userID}) {
    const [message,setMessage]=useState("")
    const [chats,setChats]=useState([])
    const socketRef= useRef(null);
    useEffect(() => {
      if (!roomID) {
        console.log("roomID is not available yet. Waiting...");
        return; // Don't run until roomID is available
      }
    
      socketRef.current = io("https://chatroom-samd.onrender.com");
    
      socketRef.current.on("connect", () => {
        console.log("Connected. Sending roomId:", roomID);
        socketRef.current.emit("conMessage", { "message": "new message", "roomId": roomID });
      });
    
      socketRef.current.on("message", (message) => {
        setChats((prevState) => [...prevState, { "sender": "other", "text": message.message }]);
      });
    
      return () => {
        socketRef.current.disconnect();
      };
    }, [roomID]); // Add roomID as a dependency
    
        //  connect to the websocket
      function sendMessage(){
          if(socketRef.current.connected){
            socketRef.current.emit("message",{"message":message,"roomId":roomID})
            setChats((prevState)=>[...prevState,{"sender":"self","text":message}])
          }
      }
      useEffect(()=>console.log("this is from chats state"+chats),[chats])

  return (
    <div className="chatContainer" style={{
      display: "flex",
      flexDirection: "column",
      height: "30rem",
      border: "2px solid #ccc",
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "#f9f9f9",
      padding: "10px"
    }}>
      <div className="chatBox" style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "25rem",
        overflowY: "auto",
        padding: "10px"
      }}>
        {chats.map((val, ind) => (
          <p key={ind} style={{
            maxWidth: "60%",
            padding: "10px",
            margin: "5px",
            borderRadius: "15px",
            backgroundColor: val.sender === "self" ? "#0084ff" : "#e0e0e0",
            color: val.sender === "self" ? "white" : "black",
            alignSelf: val.sender === "self" ? "flex-end" : "flex-start",
            textAlign: val.sender === "self" ? "right" : "left"
          }}>
            {val.text}
          </p>
        ))}
      </div>
    
      <div className="textAndButton" style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderTop: "1px solid #ccc",
        backgroundColor: "white"
      }}>
        <input type="text" style={{
          flex: "1",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "20px",
          outline: "none"
        }} 
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message..." />
    
        <button onClick={sendMessage} style={{
          marginLeft: "10px",
          padding: "10px 15px",
          border: "none",
          borderRadius: "20px",
          backgroundColor: "#0084ff",
          color: "white",
          cursor: "pointer"
        }}>
          Send
        </button>
      </div>
    </div>
    
  )
}

export default Chat
