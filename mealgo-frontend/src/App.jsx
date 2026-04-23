import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'

import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import Admin from './pages/Admin/Admin'

import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Payment from './pages/Payment/Payment'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const isAdminPage =
    location.pathname.startsWith("/admin")

  const openLogin = () => {
    setShowLogin(true)
  }

  const handleLoginSuccess = (user) => {

    setShowLogin(false)

    if (user.role === "ADMIN") {
      navigate("/admin")
    } else {
      navigate("/")
    }
  }

  return (
    <>

      {showLogin &&
        <LoginPopup
          setShowLogin={setShowLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      }

      {!isAdminPage &&
        <>
          <div className='app'>
            <Navbar openLogin={openLogin} />

            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/cart' element={<Cart openLogin={openLogin} />} />
              <Route path='/order' element={<PlaceOrder openLogin={openLogin} />} />
              <Route path='/myorders' element={<MyOrders />} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/payment/:id' element={<Payment />} />
            </Routes>
          </div>

          <Footer />
        </>
      }

      {isAdminPage &&
        <Routes>
          <Route path='/admin' element={<Admin />} />
        </Routes>
      }

    </>
  )
}

export default App