import { useState } from 'react'
import './App.css'
import OTP from './otp'

function App() {
  const [count, setCount] = useState(0);

  const handleOTPComplete = (data) => {
    console.log({data});
  }

  return (
      <div>
        <center style={{fontSize:"60px", fontWeight:"bold" , color: "white"}}> OTP </center>
        <OTP count={4} onOTPComplete={handleOTPComplete}/>
      </div>
  )
}

export default App
