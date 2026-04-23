import React, { useContext, useEffect, useMemo, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/storeContext'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'

import codImg from '../../assets/cod.png'
import cardImg from '../../assets/card.png'

import axios from 'axios'
import { API_URL } from '../../config/api'

const PlaceOrder = ({ openLogin }) => {

    const { cartItems, getTotalCartAmount, clearCart } = useContext(StoreContext)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [orderId, setOrderId] = useState(null)

    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [note, setNote] = useState("")

    const [paymentMethod, setPaymentMethod] = useState("COD")

    const [cardNumber, setCardNumber] = useState("")
    const [cardHolder, setCardHolder] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")

    const cartOrderItems = useMemo(() => {
        return Object.entries(cartItems)
            .filter(([, qty]) => qty > 0)
            .map(([foodId, qty]) => ({
                foodId: Number(foodId),
                quantity: qty
            }))
    }, [cartItems])

    // auto scroll top khi vào trang
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (!user) {
            openLogin()
            navigate("/cart")
        }
    }, [user])

    const total =
        getTotalCartAmount() === 0
            ? 0
            : getTotalCartAmount() + 2

    const handleProceed = async (e) => {
        e.preventDefault()

        const payload = {
            userId: user.id,
            fullName,
            phone,
            address,
            note,
            paymentMethod,
            items: cartOrderItems
        }

        const res = await axios.post(`${API_URL}/orders`, payload)

        if (res.data.success) {

            setOrderId(res.data.orderId)

            if (paymentMethod === "COD") {
                await axios.delete(`${API_URL}/cart/${user.id}`)
                clearCart()

                alert("Order placed successfully!")
                navigate("/myorders")
                window.scrollTo(0, 0)

            } else {
                setStep(2)

                // sang payment auto scroll top
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    })
                }, 100)
            }
        }
    }

    const payResult = async (success) => {

        await axios.put(
            `${API_URL}/orders/${orderId}/pay?success=${success}`
        )

        if (success) {
            await axios.delete(`${API_URL}/cart/${user.id}`)
            clearCart()

            alert("Payment Success!")
            navigate("/myorders")
            window.scrollTo(0, 0)

        } else {
            alert("Payment Failed!")
        }
    }

    return (
        <div className='place-order'>

            {/* LEFT */}
            <div className="place-order-left">

                {step === 1 &&
                    <form onSubmit={handleProceed}>

                        <p className="title">Delivery Information</p>

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

                        {/* PAYMENT METHOD ĐẸP */}
                        <div className="payment-method-box">

                            <p className='pay-title'>
                                Select Payment Method
                            </p>

                            <div className="pay-grid">

                                <div
                                    className={
                                        paymentMethod === "COD"
                                            ? "pay-card active"
                                            : "pay-card"
                                    }
                                    onClick={() => setPaymentMethod("COD")}
                                >
                                    <img src={codImg} alt="" className="pay-icon-img" />
                                    <h4>Cash On Delivery</h4>
                                    <p>Pay when receiving order</p>
                                </div>

                                <div
                                    className={
                                        paymentMethod === "CARD"
                                            ? "pay-card active"
                                            : "pay-card"
                                    }
                                    onClick={() => setPaymentMethod("CARD")}
                                >
                                    <img src={cardImg} alt="" className="pay-icon-img" />
                                    <h4>Card / VNPay / Momo</h4>
                                    <p>Online payment gateway</p>
                                </div>

                            </div>

                        </div>

                        <button className='main-btn'>
                            Proceed To Payment
                        </button>

                    </form>
                }

                {step === 2 &&
                    <div>

                        <p className="title">Payment</p>

                        <input
                            type="text"
                            placeholder='Card Number'
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder='Card Holder'
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                        />

                        <div className="multi-fields">

                            <input
                                type="text"
                                placeholder='MM/YY'
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder='CVV'
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                            />

                        </div>

                        <button
                            className='success-btn'
                            onClick={() => payResult(true)}
                        >
                            Pay Success
                        </button>

                        <button
                            className='fail-btn'
                            onClick={() => payResult(false)}
                        >
                            Pay Fail
                        </button>

                    </div>
                }

            </div>

            {/* RIGHT */}
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