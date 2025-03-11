import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Create from './Create'
import Login from './Login'
import Chat from './Chat'
import {BrowserRouter,Route,Routes} from "react-router-dom";
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/create" element={<Create></Create>} ></Route>
        <Route path="/chat" element={<Chat></Chat>}></Route>
      </Routes>
    </BrowserRouter>
      </>
  )
}

export default App
