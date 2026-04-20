import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import { useNavigate } from 'react-router-dom'

const App = () => {

  const [showLogin,setShowLogin] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState(null) // ví dụ: "/order"
  const navigate = useNavigate();

  const openLogin = (reason) => {
    // reason: "checkout" | "navbar" | ...
    if (reason === "checkout") {
      setPendingRedirect("/order");
    } else {
      setPendingRedirect(null);
    }
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);

    if (pendingRedirect) {
      const to = pendingRedirect;
      setPendingRedirect(null);
      navigate(to);
    }
  };

  return (
    <>
    {showLogin
      ? <LoginPopup setShowLogin={setShowLogin} onLoginSuccess={handleLoginSuccess} />
      : <></>
    }
      <div className='app'>
        <Navbar openLogin={openLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart openLogin={openLogin} />} />
          <Route path='/order' element={<PlaceOrder openLogin={openLogin} />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
