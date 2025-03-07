import React, { useState } from 'react'
import {Link} from "react-router-dom";

function Create() {
const [member,setMember]=useState(0)
const [key,setKey]=useState("")
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
        console.log(key,user)
    }

    
}
  return (
    <div>
        <input onChange={(event)=>{
            setMember(event.target.value)
        }} type="text" placeholder="Enter no people to add in that room"></input>
        <button onClick={createRoom}>Create Room</button>
        <div className='room_user' style={{"width":"400px","height":"200px","backgroundColor":"red","overflow":"scroll"}}>
            
                <p>{key}</p>
                {
                user && user.map((val,ind,arr)=><p>{val}</p>)
                }
            
        </div>
    </div>
  )
}

export default Create