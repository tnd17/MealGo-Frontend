import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

const LoginPopup = ({setShowLogin}) => {
  //doi giua login va sign up
    const [currState,setCurrState] = useState("Login")

    //luu du lieu nguoi dung nhap vao form
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    //lay ham login tu authContext de luu user
    const { login } = useContext(AuthContext)

    //ham chay khi bam submit
    const onSubmitHandler = async (e) => {
      //chan reload trang mac dinh cua form
      e.preventDefault()

      try {
        if(currState === "Sign Up"){
          await axios.post("http://localhost:8080/api/auth/register",
            {
              name: name,
              email: email,
              password: password
            }
          )

          alert("Register successful!")

          //dang ky xong quay ve dang nhap
          setCurrState("Login")

          //xoa du lieu cu
          setName("")
          setEmail("")
          setPassword("")
        }
        else{
          const response = await axios.post("http://localhost:8080/api/auth/login",
            {
              email: email,
              password: password
            }
          )

          //response.data la user backend tra ve
          login(response.data)

          alert("Login successfull")

          //tat popup
          setShowLogin(false)
        }
      } catch (error) {
        alert("Email or password incorrect")

        console.log(error)
      }
    }

  return (
    <div className='login-popup'>
      <form onSubmit={onSubmitHandler} className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
            {currState==="Login"?<></>:<input type="text" placeholder='Your name' required value={name} onChange={(e) => setName(e.target.value)} />}
            <input type="email" placeholder='Your email' required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"
        ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
        :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
