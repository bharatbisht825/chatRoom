// this page will send "RoomId" to create sever URL and also deatils of all the users allowed in the room.
// it will verify details like this: 1- it will check the url param into the database and also the key given by the user 
// in db we will have key that will be the dedicatted route at which a particular room will be created it will have an array of values stored to it which will be taken by the user to enter in that room.


// flow for otp auth
//1 i will be having a componet in which i will pass a fucntion as prop that fuction will change the state 
// of a boolean variable saying it is authenticated and hence we will navigate to chat page
// 2 first login page -> render the otp Verification page-> route to chat page

import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import Chat from './Chat'

function Login() {
    const [userId,setUserId]=useState()
    const [roomId,setRoomId]=useState() 

    const [authenticated,setAuthenticated]=useState(false);
    async function authenticate(){
        const body={
            "roomId":roomId,
            "userId":userId
        }
        const payload={
            method:'POST',
            headers:{
                "Content-type":'application/json'
            },
            body:JSON.stringify(body)
        }
        const result= await fetch("http://localhost:3000/joinRoom",payload)
        const output=await result.json()
        if(output.message=="Verified"){
            setAuthenticated(true)
        }
    }

    // send request for email authentication if  authenticated

    
    if(authenticated){
        return(<Chat roomID={roomId} userID={userId}></Chat>)
    }
    else{
  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "10px",
      }}>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Join a Room</h2>
      
        <input type="text" placeholder="Enter the room ID" 
          onChange={(event) => setRoomId(event.target.value)}
          style={{
            width: "250px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none"
          }} />
      
        <input type="text" placeholder="Enter your user key"
          onChange={(event) => setUserId(event.target.value)}
          style={{
            width: "250px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none"
          }} />
      
        <button onClick={authenticate} style={{
          width: "150px",
          padding: "10px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#0084ff",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          marginTop: "10px"
        }}>
          Join
        </button>
      
        <Link to="/create" style={{
          marginTop: "10px",
          textDecoration: "none",
          color: "#0084ff",
          fontWeight: "bold"
        }}>
          Create Room
        </Link>
      </div>
      
  )}
}

export default Login