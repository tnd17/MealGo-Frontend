import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { AuthContext } from '../../context/authContext'
import axios from 'axios'
import { API_URL } from '../../config/api'

const LoginPopup = ({ setShowLogin, onLoginSuccess }) => {
  //doi giua login va sign up
  const [currState, setCurrState] = useState("Login")

  //luu du lieu nguoi dung nhap vao form
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null) // { type: "success"|"error", text: string }

  //lay ham login tu authContext de luu user
  const { login } = useContext(AuthContext)

  //ham chay khi bam submit
  const onSubmitHandler = async (e) => {
    //chan reload trang mac dinh cua form
    e.preventDefault()

    try {
      setIsSubmitting(true)
      setMessage(null)
      if (currState === "Sign Up") {
        const res = await axios.post(`${API_URL}/auth/register`,
          {
            name: name,
            email: email,
            password: password
          }
        )

        setMessage({ type: "success", text: typeof res.data === "string" ? res.data : "Register successful!" })

        //dang ky xong quay ve dang nhap
        setCurrState("Login")

        //xoa du lieu cu
        setName("")
        setEmail("")
        setPassword("")
      }
      else {
        const response = await axios.post(`${API_URL}/auth/login`,
          {
            email: email,
            password: password
          }
        )

        //response.data la user backend tra ve
        const data = response.data;

        // Nếu backend trả string => lỗi
        if (typeof data === "string") {
          setMessage({
            type: "error",
            text: data
          });
          return;
        }

        // Nếu backend trả object user
        if (data && data.id) {
          login(data);

          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            setShowLogin(false);
          }

          return;
        }

        // fallback
        setMessage({
          type: "error",
          text: "Login failed"
        });

        // nếu có pending redirect ở App thì App sẽ tự navigate
        if (onLoginSuccess) onLoginSuccess()
        else setShowLogin(false)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Email or password incorrect." })
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onSubmitHandler} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        {message
          ? <p style={{ color: message.type === "error" ? "#d32f2f" : "#2e7d32", marginTop: 8 }}>{message.text}</p>
          : null
        }
        <div className="login-popup-inputs">
          {currState === "Login" ? <></> : <input type="text" placeholder='Your name' required value={name} onChange={(e) => setName(e.target.value)} />}
          <input type="email" placeholder='Your email' required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : (currState === "Sign Up" ? "Create account" : "Login")}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
