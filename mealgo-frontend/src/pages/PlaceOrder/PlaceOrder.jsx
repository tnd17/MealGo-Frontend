import React, { useContext, useEffect, useMemo, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/storeContext'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../config/api'

const PlaceOrder = ({ openLogin }) => {

  const { cartItems, getTotalCartAmount, clearCart } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // dùng để tránh redirect về cart sau khi đặt hàng thành công
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const cartOrderItems = useMemo(() => {
    return Object.entries(cartItems)
      .filter(([, quantity]) => quantity > 0)
      .map(([foodId, quantity]) => ({
        foodId: Number(foodId),
        quantity
      }));
  }, [cartItems]);

  // chưa login thì quay về cart + mở popup login
  useEffect(() => {
    if (!user) {
      openLogin("checkout");
      navigate('/cart');
    }
  }, [user, openLogin, navigate]);

  // cart rỗng thì chặn vào trang order
  // nhưng nếu vừa order thành công thì bỏ qua
  useEffect(() => {
    if (!orderSuccess && cartOrderItems.length === 0) {
      navigate('/cart', {
        state: {
          message: {
            type: "error",
            text: "Your cart is empty."
          }
        }
      });
    }
  }, [cartOrderItems.length, orderSuccess, navigate]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage({
        type: "error",
        text: "Please login before placing order."
      });
      openLogin("checkout");
      return;
    }

    if (cartOrderItems.length === 0) {
      setMessage({
        type: "error",
        text: "Your cart is empty."
      });
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setMessage({
        type: "error",
        text: "Please fill full name, phone and address."
      });
      return;
    }

    const payload = {
      userId: user.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
      items: cartOrderItems
    };

    try {
      if (isSubmitting) return;

      setIsSubmitting(true);
      setMessage(null);

      const response = await axios.post(`${API_URL}/orders`, payload);
      const data = response.data;

      if (data && data.success) {

        setMessage({
          type: "success",
          text: `Order placed successfully! Order #${data.orderId}`
        });

        // đánh dấu thành công để useEffect không đá về cart
        setOrderSuccess(true);

        clearCart();

        // chuyển luôn về home
        navigate('/');

        return;
      }

      setMessage({
        type: "error",
        text: data?.message || "Cannot place order. Please try again."
      });

    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: "Cannot place order. Please try again."
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className='place-order' onSubmit={handleSubmitOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        {message && (
          <p
            style={{
              color: message.type === "error" ? "#d32f2f" : "#2e7d32",
              marginTop: 10
            }}
          >
            {message.text}
          </p>
        )}

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
          placeholder='Note (optional)'
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>
                $
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          <button
            type='submit'
            disabled={isSubmitting || cartOrderItems.length === 0}
          >
            {isSubmitting ? "PLACING..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder