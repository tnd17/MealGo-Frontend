import React, { useContext, useEffect, useMemo, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/storeContext'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'

import codImg from '../../assets/cod.png'
import cardImg from '../../assets/card.png'

import axios from 'axios'
import { API_URL } from '../../config/api'

const PlaceOrder = () => {

    const { cartItems, getTotalCartAmount, clearCart } = useContext(StoreContext)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [orderId, setOrderId] = useState(null)

    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [note, setNote] = useState("")
    const [email, setEmail] = useState("")

    const [paymentMethod, setPaymentMethod] = useState("COD")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)

    const cartOrderItems = useMemo(() => {
        return Object.entries(cartItems)
            .filter(([, qty]) => qty > 0)
            .map(([foodId, qty]) => ({
                foodId: Number(foodId),
                quantity: qty
            }))
    }, [cartItems])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const total =
        getTotalCartAmount() === 0
            ? 0
            : getTotalCartAmount() + 2

    // =========================
    // HANDLE ORDER
    // =========================
    const handleProceed = async (e) => {
        e.preventDefault()

        if (isSubmitting) return
        setIsSubmitting(true)

        const payload = {
            userId: user?.id || null,
            email: user ? null : email,
            fullName,
            phone,
            address,
            note,
            paymentMethod,
            items: cartOrderItems
        }

        try {
            const res = await axios.post(`${API_URL}/orders`, payload)

            if (res.data.success) {

                setOrderId(res.data.orderId)

                // =========================
                // 🔥 CASE 1: COD (ALL)
                // =========================
                if (paymentMethod === "COD") {

                    if (user) {
                        await axios.delete(`${API_URL}/cart/${user.id}`)
                        clearCart()
                    }

                    setShowSuccessPopup(true)
                }

                // =========================
                // 🔥 CASE 2: GUEST + CARD
                // =========================
                else if (!user && paymentMethod === "CARD") {

                    setShowSuccessPopup(true)
                }

                // =========================
                // 🔥 CASE 3: CUSTOMER + CARD
                // =========================
                else {

                    setStep(2)

                    setTimeout(() => {
                        window.scrollTo(0, 0)
                    }, 100)
                }
            }

        } catch (err) {
            console.error(err)
            alert("Error placing order")
        } finally {
            setIsSubmitting(false)
        }
    }

    // =========================
    // FAKE PAYMENT (CUSTOMER)
    // =========================
    const payResult = async (success) => {

        if (isSubmitting) return
        setIsSubmitting(true)

        try {
            await axios.put(
                `${API_URL}/orders/${orderId}/pay?success=${success}`
            )

            if (success) {

                if (user) {
                    await axios.delete(`${API_URL}/cart/${user.id}`)
                    clearCart()
                }

                setShowSuccessPopup(true)

            } else {
                alert("Payment Failed!")
            }

        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClosePopup = () => {
        setShowSuccessPopup(false)
        navigate("/")
        window.scrollTo(0, 0)
    }

    return (
        <div className='place-order'>

            {/* POPUP */}
            {showSuccessPopup &&
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>🎉 Order Created!</h2>

                        {!user && paymentMethod === "CARD"
                            ? <p>Please check your email to complete payment.</p>
                            : <p>Your order has been placed successfully.</p>
                        }

                        <button onClick={handleClosePopup}>
                            OK
                        </button>
                    </div>
                </div>
            }

            <div className="place-order-left">

                {step === 1 &&
                    <form onSubmit={handleProceed}>

                        <p className="title">Delivery Information</p>

                        {!user &&
                            <input
                                type="email"
                                placeholder='Your Email (Guest checkout)'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        }

                        <input
                            type="text"
                            placeholder='Full Name'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder='Phone'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder='Note'
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <div className="payment-method-box">

                            <p className='pay-title'>Select Payment Method</p>

                            <div className="pay-grid">

                                <div
                                    className={paymentMethod === "COD" ? "pay-card active" : "pay-card"}
                                    onClick={() => setPaymentMethod("COD")}
                                >
                                    <img src={codImg} alt="" className="pay-icon-img" />
                                    <h4>Cash On Delivery</h4>
                                </div>

                                <div
                                    className={paymentMethod === "CARD" ? "pay-card active" : "pay-card"}
                                    onClick={() => setPaymentMethod("CARD")}
                                >
                                    <img src={cardImg} alt="" className="pay-icon-img" />
                                    <h4>Card / VNPay</h4>
                                </div>

                            </div>

                        </div>

                        <button
                            className='main-btn'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Proceed To Payment"}
                        </button>

                    </form>
                }

                {step === 2 &&
                    <div>

                        <p className="title">Payment</p>

                        <input placeholder='Card Number' />
                        <input placeholder='Card Holder' />

                        <div className="multi-fields">
                            <input placeholder='MM/YY' />
                            <input placeholder='CVV' />
                        </div>

                        <button
                            className='success-btn'
                            onClick={() => payResult(true)}
                            disabled={isSubmitting}
                        >
                            Pay Success
                        </button>

                        <button
                            className='fail-btn'
                            onClick={() => payResult(false)}
                            disabled={isSubmitting}
                        >
                            Pay Fail
                        </button>

                    </div>
                }

            </div>

            <div className="place-order-right">

                <div className="cart-total">

                    <h2>Order Summary</h2>

                    <div className="cart-total-details">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>

                    <div className="cart-total-details">
                        <p>Delivery</p>
                        <p>$2</p>
                    </div>

                    <hr />

                    <div className="cart-total-details">
                        <b>Total</b>
                        <b>${total}</b>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default PlaceOrder