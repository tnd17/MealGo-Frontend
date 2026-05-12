import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/storeContext'
import { useLocation, useNavigate } from 'react-router-dom';
import { foodImages } from '../../assets/assets';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import { API_URL } from '../../config/api';

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount } = useContext(StoreContext);

  const [message, setMessage] = React.useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const stateMessage = location.state?.message;
    if (stateMessage) {
      setMessage(stateMessage);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const handleCheckout = () => {

    if (getTotalCartAmount() === 0) {
      setMessage({ type: "error", text: "Your cart is empty." });
      return;
    }

    // cho phép guest checkout
    navigate('/order');
  }

  const { user } = useContext(AuthContext)

  const { discountAmount, setDiscountAmount, appliedVoucher, setAppliedVoucher } = useContext(StoreContext)

  const [voucherInput, setVoucherInput] = React.useState("")

  const handleApplyVoucher = async () => {

    if (!user) {
      setMessage({
        type: "error",
        text: "Login required to use voucher"
      })
      return
    }

    try {
      const res = await axios.post(
        `${API_URL}/vouchers/apply`,
        {
          code: voucherInput,
          totalAmount: getTotalCartAmount()
        }
      )

      setDiscountAmount(res.data.discountAmount)
      setAppliedVoucher(voucherInput)

      setMessage({
        type: "success",
        text: "Voucher applied successfully"
      })

    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data || "Invalid voucher"
      })
    }
  }

  return (
    <div className='cart'>

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item.id] > 0) {
            return (
              <div key={item.id}>
                <div className="cart-items-title cart-items-item">
                  <img src={foodImages[item.image_url]} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item.id]}</p>
                  <p>${item.price * cartItems[item.id]}</p>
                  <p
                    onClick={() => removeFromCart(item.id)}
                    className='cross'
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>

      <div className="cart-bottom">

        <div className="cart-total">
          <h2>Cart Totals</h2>

          {message &&
            <p style={{
              color: message.type === "error" ? "#d32f2f" : "#2e7d32",
              marginTop: 10
            }}>
              {message.text}
            </p>
          }

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
              <p>Discount</p>
              <p>-${discountAmount}</p>
              <hr />
              <b>Total</b>
              <b>
                {
                  getTotalCartAmount() === 0
                    ? 0
                    : getTotalCartAmount() + 2 - discountAmount
                }
              </b>
            </div>
          </div>

          <button onClick={handleCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>
              {user
                ? "Enter voucher code"
                : "Login to use voucher"}
            </p>

            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder='Voucher code'
                disabled={!user}
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
              />

              <button
                onClick={handleApplyVoucher}
                disabled={!user}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

      </div>

    </div >
  )
}

export default Cart