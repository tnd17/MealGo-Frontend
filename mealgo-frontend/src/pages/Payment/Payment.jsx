import React, { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { useNavigate, useParams } from 'react-router-dom'

const Payment = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [card,setCard] = useState("")
  const [name,setName] = useState("")
  const [cvv,setCvv] = useState("")

  const pay = async(success)=>{

    await axios.put(
      `${API_URL}/orders/${id}/pay?success=${success}`
    )

    if(success){
      alert("Payment Success!")
      navigate("/myorders")
    }else{
      alert("Payment Failed!")
    }
  }

  return (
    <div style={{padding:"40px"}}>

      <h1>Payment</h1>

      <input placeholder='Email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input placeholder='Card Number'
        value={card}
        onChange={(e)=>setCard(e.target.value)}
      />

      <input placeholder='Card Holder'
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <input placeholder='CVV'
        value={cvv}
        onChange={(e)=>setCvv(e.target.value)}
      />

      <br/><br/>

      <button onClick={()=>pay(true)}>
        Pay Success
      </button>

      <button onClick={()=>pay(false)}>
        Pay Fail
      </button>

    </div>
  )
}

export default Payment