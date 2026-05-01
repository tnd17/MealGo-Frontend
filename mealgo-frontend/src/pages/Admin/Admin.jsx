import React, { useContext, useEffect, useState } from 'react'
import './Admin.css'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { API_URL } from '../../config/api'

const Admin = () => {

  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [tab, setTab] = useState("dashboard")
  const [orders, setOrders] = useState([])

  const [loadingConfirm, setLoadingConfirm] = useState(null) // 🔥 chống spam click

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    if (tab === "orders") {
      loadOrders()
    }
  }, [tab])

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/admin`)
      setOrders(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${API_URL}/orders/${orderId}/status?status=${status}`
      )
      loadOrders()
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // 🔥 CONFIRM PAYMENT (EMAIL FLOW)
  const confirmPayment = async (orderId) => {
    if (loadingConfirm) return // chống double click

    setLoadingConfirm(orderId)

    try {
      await axios.put(`${API_URL}/orders/${orderId}/confirm-payment`)

      alert("Payment confirmed! Email sent to customer.")

      loadOrders()
    } catch (err) {
      console.log(err)
      alert("Error confirming payment")
    } finally {
      setLoadingConfirm(null)
    }
  }

  return (
    <div className='admin-layout'>

      {/* TOPBAR */}
      <div className="admin-topbar">

        <div className="admin-left">
          <img src={assets.logo} alt="" />

          <div>
            <h2>MealGo</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        <div className="admin-right">
          <span>Hi, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>

      </div>

      {/* BODY */}
      <div className="admin-body">

        {/* SIDEBAR */}
        <div className="admin-sidebar">

          <button
            className={tab === "dashboard" ? "active" : ""}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>

          <button
            className={tab === "foods" ? "active" : ""}
            onClick={() => setTab("foods")}
          >
            Foods
          </button>

          <button
            className={tab === "users" ? "active" : ""}
            onClick={() => setTab("users")}
          >
            Users
          </button>

          <button onClick={() => navigate("/")}>
            Back to Shop
          </button>

        </div>

        {/* CONTENT */}
        <div className="admin-content">

          {tab === "dashboard" &&
            <>
              <h1>Dashboard</h1>
              <p>Welcome back admin.</p>
            </>
          }

          {tab === "orders" &&
            <>
              <h1>Orders</h1>
              <p>Manage all customer orders here.</p>

              <div className="admin-orders">

                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map(order => {

                      const isEmailPayment =
                        order.accountType === "GUEST" &&
                        order.paymentMethod === "CARD" &&
                        order.paymentStatus === "UNPAID"

                      return (
                        <tr key={order.id}>
                          <td>#{order.id}</td>

                          <td>{order.customerName}</td>

                          <td>
                            <span className={
                              order.accountType === "GUEST"
                                ? "badge guest"
                                : "badge customer"
                            }>
                              {order.accountType}
                            </span>
                          </td>

                          <td>${order.totalAmount}</td>

                          <td>
                            {order.paymentMethod}
                            <br />
                            <small>
                              {order.paymentStatus === "UNPAID" && order.accountType === "GUEST" && order.paymentMethod === "CARD"
                                ? "Waiting for email payment"
                                : order.paymentStatus}
                            </small>
                          </td>

                          <td>{order.status}</td>

                          <td>{order.createdAt.slice(0, 10)}</td>

                          <td>

                            {isEmailPayment ? (
                              <button
                                className="confirm-btn"
                                disabled={loadingConfirm === order.id}
                                onClick={() => confirmPayment(order.id)}
                              >
                                {loadingConfirm === order.id
                                  ? "Processing..."
                                  : "Confirm Payment"}
                              </button>
                            ) : (
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateStatus(order.id, e.target.value)
                                }
                              >
                                <option>PENDING</option>
                                <option>CONFIRMED</option>
                                <option>SHIPPING</option>
                                <option>COMPLETED</option>
                                <option>CANCELLED</option>
                              </select>
                            )}

                          </td>
                        </tr>
                      )
                    })}
                  </tbody>

                </table>

              </div>
            </>
          }

          {tab === "foods" &&
            <>
              <h1>Foods</h1>
              <p>Add / Edit / Delete foods.</p>
            </>
          }

          {tab === "users" &&
            <>
              <h1>Users</h1>
              <p>View all registered users.</p>
            </>
          }

        </div>

      </div>

    </div>
  )
}

export default Admin