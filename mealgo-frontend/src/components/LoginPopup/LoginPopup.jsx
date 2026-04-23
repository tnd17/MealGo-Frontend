import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { AuthContext } from '../../context/authContext'
import axios from 'axios'
import { API_URL } from '../../config/api'

const LoginPopup = ({ setShowLogin, onLoginSuccess }) => {

  const [currState, setCurrState] = useState("Login")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [message, setMessage] = useState(null)

  const { login } = useContext(AuthContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {

      if (currState === "Sign Up") {

        await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password
        })

        setMessage({
          type: "success",
          text: "Register success!"
        })

        setCurrState("Login")
        return
      }

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })

      const data = response.data

      if (data && data.id) {

        // lưu user + role
        login(data)

        // callback App.jsx
        onLoginSuccess(data)

        return
      }

      setMessage({
        type: "error",
        text: "Login failed"
      })

    } catch (error) {

      setMessage({
        type: "error",
        text: "Wrong email or password"
      })

    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onSubmitHandler} className="login-popup-container">

        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        {message &&
          <p>{message.text}</p>
        }

        <div className="login-popup-inputs">

          {currState === "Sign Up" &&
            <input
              type="text"
              placeholder='Your name'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          }

          <input
            type="email"
            placeholder='Email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <button type='submit'>
          {currState === "Login" ? "Login" : "Create Account"}
        </button>

        {currState === "Login"
          ? <p>Create account?
            <span onClick={() => setCurrState("Sign Up")}> Sign Up</span>
          </p>
          : <p>Already have account?
            <span onClick={() => setCurrState("Login")}> Login</span>
          </p>
        }

      </form>
    </div>
  )
}

export default LoginPopup