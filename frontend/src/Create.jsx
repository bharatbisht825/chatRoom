import React, { use, useState } from 'react'
import {Link} from "react-router-dom";

function Create() {
const [member,setMember]=useState(0)
const [email,setEmail]=useState("")
const [key,setKey]=useState("")
const [sentStatus,setSentStatus]=useState(false)
const [user,setUser]=useState(null)
const [err,showErr]=useState(false)
async function createRoom(){
    const body={
        "member":member,
        "email":email
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
    console.log(data)
    if(data.err=="Not Premium"){
      showErr(true)
    }
    else {if(data.key && data.users && data.err!="Not Premium"){
        setKey(data.key)
        setUser(data.users)
        const sentStatus=await emailData(email,data.key,data.users);
        console.log(sentStatus)
        if(sentStatus=="OK"){
                setSentStatus(true)
        }
        
    }
}

    // this fuction is used to send created users to email
    async function emailData(email,key,user) {
        
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
      
        <input type="number" placeholder="Enter number of people to add"
          required={true}
          onChange={(event) => setMember(event.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none"
          }} />
      
        <input type="email" placeholder="Enter your email"
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
      
      
        {sentStatus && <p style={{
          fontWeight: "bold",
          marginTop: "10px"
        }}>
          The users have been sent to email successfully
          <Link to="/" style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    color: "#0084ff",
                    fontWeight: "bold"
                  }}>
                    Login
                               </Link>
        </p>}

        {err && <p style={{
          fontWeight: "bold",
          marginTop: "10px"
        }}>
          The user is not premium you cannot create more than 5 users.
          <Link to="/payment" style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    color: "#0084ff",
                    fontWeight: "bold"
                  }}>
                    Get Premium
                               </Link>
        </p>}


      </div>
      
  )
}

export default Create