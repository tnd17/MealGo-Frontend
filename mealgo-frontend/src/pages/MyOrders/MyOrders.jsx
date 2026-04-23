import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'

const MyOrders = ({ openLogin }) => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        if(!user){
            openLogin("navbar");
            navigate('/');
            return;
        }

        fetchOrders();

    }, []);

    const fetchOrders = async () => {
        try{
            const res = await axios.get(
                `${API_URL}/orders/user/${user.id}`
            );
            setOrders(res.data);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div style={{padding:'40px 0'}}>
            <h2>My Orders</h2>

            {orders.length === 0 && <p>No orders yet.</p>}

            {orders.map(order => (
                <div key={order.id}
                    style={{
                        border:'1px solid #ddd',
                        padding:'15px',
                        margin:'15px 0',
                        borderRadius:'10px'
                    }}
                >
                    <p><b>Order #{order.id}</b></p>
                    <p>Total: ${order.totalAmount}</p>
                    <p>Status: {order.status}</p>
                    <p>Date: {order.createdAt}</p>
                </div>
            ))}
        </div>
    )
}

export default MyOrders