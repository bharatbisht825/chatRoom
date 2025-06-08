import React, { useEffect, useRef, useState } from 'react'
import addImage from "./add-image.png"
import {io} from "socket.io-client"
function Chat({roomID,userID,isPremium}) {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [message,setMessage]=useState("")
    const [chats,setChats]=useState([])
    const [file,setFile]=useState("")
    const socketRef= useRef(null);
    useEffect(() => {
      if (!roomID) {
        console.log("roomID is not available yet. Waiting...");
        return; // Don't run until roomID is available
      }
    
      socketRef.current = io(API_BASE_URL);
    
      socketRef.current.on("connect", () => {
        console.log("Connected. Sending roomId:", roomID);
        socketRef.current.emit("conMessage", { "message": "new message", "roomId": roomID });
      });
    
      socketRef.current.on("message", (message) => {
        setChats((prevState) => [...prevState, { "sender": "other", "text": message.message ,"type":message.type}]);
      });

      socketRef.current.on("sendImage",(message)=>{
        console.log("image is recieved")
        setChats((prevState) => [...prevState, { "sender": "other", "text": message.message ,"type":message.type}]);
      })
    
      return () => {
        socketRef.current.disconnect();
      };
    }, [roomID]); // Add roomID as a dependency
    
        //  connect to the websocket
      function sendMessage(event){
        if(file==""){
          console.log("sending normal message")
          if(socketRef.current.connected){
            if(message!=""){
            socketRef.current.emit("message",{"message":message,"roomId":roomID})
            
            setChats((prevState)=>[...prevState,{"sender":"self","text":message,"type":"text"}])
            setMessage("")
            }
          }
        }
        else{
          // first create a file reader object
          console.log("sending image")
          const fileReader=new FileReader()
          fileReader.onload=(event)=>{
            const base64Encode=event.target.result;
            socketRef.current.emit("sendImage",{"message":base64Encode,"roomId":roomID})
            setChats((prevState)=>[...prevState,{"sender":"self","text":base64Encode,"type":"image"}])
            setFile("")
          };
          fileReader.readAsDataURL(file)
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
        {chats.map((val, ind) => {
          if(val.type=="text")

         { return(
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
        )}
        else if(val.type=="image"){
          return (<img src={val.text} alt="Received" style={{ maxWidth: "100px",maxHeight:"100px" ,alignSelf: val.sender === "self" ? "flex-end" : "flex-start" }} />)
        }
      }
        
        )}
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
        onKeyDown={(e)=>{
          if (e.key === "Enter"){
            sendMessage();}
        
        }} 
        onChange={(event) => setMessage(event.target.value)}
        value={message}
        placeholder="Type a message..." />
        {isPremium && <div>
          <label htmlFor='input-file'>
            <img src={addImage} style={{maxWidth:"26px",marginTop:"7px",marginLeft:"7px"}}></img>
          </label>
          <input type="file" id="input-file" style={{display:"none"}} onChange={(e)=>setFile(e.target.files[0])}></input>
        </div>}
      </div>
    
        <button onClick={
          sendMessage
        } style={{
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
    
  )
}

export default Chat
