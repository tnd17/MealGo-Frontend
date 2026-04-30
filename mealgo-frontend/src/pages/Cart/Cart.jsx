import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/storeContext'
import { useLocation, useNavigate } from 'react-router-dom';
import { foodImages } from '../../assets/assets';

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
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

          <button onClick={handleCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Cart