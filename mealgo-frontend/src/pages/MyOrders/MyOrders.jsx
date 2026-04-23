import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import './MyOrders.css'

const MyOrders = ({ openLogin }) => {

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])

    useEffect(() => {

        if (!user) {
            openLogin("navbar")
            navigate('/')
            return
        }

        fetchOrders()

    }, [])

    const fetchOrders = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/orders/user/${user.id}`
            )
            setOrders(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const getPaymentColor = (status) => {
        if (status === "PAID") return "paid"
        if (status === "FAILED") return "failed"
        return "unpaid"
    }

    return (
        <div className='myorders'>

            <h2>My Orders</h2>

            {orders.length === 0 &&
                <div className='empty-orders'>
                    No orders yet.
                </div>
            }

            {orders.map(order => (

                <div key={order.id} className='order-card'>

                    <div className="order-top">
                        <h3>Order #{order.id}</h3>

                        <span className='order-date'>
                            {order.createdAt?.replace("T", " ").slice(0, 16)}
                        </span>
                    </div>

                    <div className="order-grid">

                        <div>
                            <p className='label'>Total</p>
                            <h4>${order.totalAmount}</h4>
                        </div>

                        <div>
                            <p className='label'>Delivery</p>
                            <span className='status-badge'>
                                {order.status}
                            </span>
                        </div>

                        <div>
                            <p className='label'>Payment Method</p>
                            <span>
                                {order.paymentMethod}
                            </span>
                        </div>

                        <div>
                            <p className='label'>Payment</p>
                            <span className='pay-badge'>
                                {order.paymentStatus}
                            </span>
                        </div>

                    </div>

                    <div className='order-items'>
                        <p className='label'>Items Ordered</p>

                        {order.items?.map((item, index) => (
                            <div key={index} className='item-row'>
                                {item}
                            </div>
                        ))}
                    </div>

                </div>

            ))}

        </div>
    )
}

export default MyOrders