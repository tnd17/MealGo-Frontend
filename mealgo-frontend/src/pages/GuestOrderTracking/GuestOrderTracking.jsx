import React, { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config/api'
import './GuestOrderTracking.css'

const GuestOrderTracking = () => {

    const [email, setEmail] = useState("")
    const [orderId, setOrderId] = useState("")
    const [order, setOrder] = useState(null)

    const handleSearch = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/orders/guest-track?orderId=${orderId}&email=${email}`
            )

            setOrder(res.data)

        } catch (err) {
            alert("Order not found")
        }
    }

    return (
        <div className='guest-track-container'>

            <div className='guest-track-box'>
                <h2>Track Your Guest Order</h2>
                <p>
                    Enter your email and order ID to check order status
                </p>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />

                <button onClick={handleSearch}>
                    Track Order
                </button>
            </div>

            {order && (
                <div className='guest-order-result'>
                    <h3>Order #{order.id}</h3>

                    <div className='result-row'>
                        <span>Status:</span>
                        <strong>{order.status}</strong>
                    </div>

                    <div className='result-row'>
                        <span>Payment:</span>
                        <strong>{order.paymentStatus}</strong>
                    </div>

                    <div className='result-row'>
                        <span>Total:</span>
                        <strong>${order.totalAmount}</strong>
                    </div>

                    <div className='order-items-box'>
                        <h4>Ordered Items</h4>

                        {order.items.map((item, index) => (
                            <div key={index} className='order-item'>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default GuestOrderTracking