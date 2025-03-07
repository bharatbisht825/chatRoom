// this page will send "RoomId" to create sever URL and also deatils of all the users allowed in the room.
// it will verify details like this: 1- it will check the url param into the database and also the key given by the user 
// in db we will have key that will be the dedicatted route at which a particular room will be created it will have an array of values stored to it which will be taken by the user to enter in that room.


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
    if(authenticated){
        return(<Chat roomID={roomId} userID={userId}></Chat>)
    }
    else{
  return (
    <div>
        <input type='text' placeholder='Enter the room id' onChange={(event)=>{setRoomId(event.target.value)}}></input>
        <input type='text' placeholder='Enter the user key' onChange={(event)=>{setUserId(event.target.value)}}></input>
        <button onClick={authenticate}>Join</button>
        <Link to="/create">Create room</Link>
    </div>
  )}
}

export default Login