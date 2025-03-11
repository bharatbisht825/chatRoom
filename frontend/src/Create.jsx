import React, { use, useState } from 'react'
import {Link} from "react-router-dom";

function Create() {
const [member,setMember]=useState(0)
const [email,setEmail]=useState("")
const [key,setKey]=useState("")
const [sentStatus,setSentStatus]=useState(false)
const [user,setUser]=useState(null)
async function createRoom(){
    const body={
        "member":member
    }
    const payload={
        method:"POST",
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(body)
    }
    const fetchedData=await fetch("http://localhost:3000/createRoom",payload)
    const data=await fetchedData.json()
    if(data.key && data.users){
        setKey(data.key)
        setUser(data.users)
        const sentStatus=await emailData(email,data.key,data.users);
        console.log(sentStatus)
        if(sentStatus=="OK"){
                setSentStatus(true)
        }
    }

    async function emailData(email,key,user) {
        // fetch request to email authentication fucntion in backend

        const body={
            "email":email,
            "key":key,
            "user":user
        }
        console.log(body)
        const payload={
            "method":"POST",
            "headers":{
                "Content-type":"application/json"

            },
            "body":JSON.stringify(body)

        }
        const verificationStatus=await fetch("http://localhost:3000/emailData",payload)
        const isSent=await verificationStatus.json()
        return isSent.response.split(" ")[2]
        
    }

    
}
  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "12px",
        padding: "20px"
      }}>
        <h2 style={{ color: "#333", marginBottom: "10px" }}>Create a Room</h2>
      
        <input type="text" placeholder="Enter number of people to add"
          onChange={(event) => setMember(event.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none"
          }} />
      
        <input type="text" placeholder="Enter your email"
          required={true}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none"
          }} />
      
        <button onClick={createRoom} style={{
          width: "180px",
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
          Create Room
        </button>
      
        <div className="room_user" style={{
          width: "300px",
          height: "150px",
          overflowY: "auto",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "10px"
        }}>
          <p style={{ fontWeight: "bold", color: "#ff4d4d" }}>{key}</p>
          {user && user.map((val, ind) => (
            <p key={ind} style={{
              backgroundColor: "white",
              padding: "5px",
              borderRadius: "5px",
              marginBottom: "5px"
            }}>{val}</p>
          ))}
        </div>
      
        {sentStatus && <p style={{
          fontWeight: "bold",
          marginTop: "10px"
        }}>
          The users have been sent to email successfully
        </p>}
      </div>
      
  )
}

export default Create