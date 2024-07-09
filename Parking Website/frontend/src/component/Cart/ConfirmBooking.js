import React from 'react'
import CheckoutStep from './CheckoutSteps'
import { useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import "./ConfirmOrder.css"
import { Link, useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const {bookingInfo, cartItems} = useSelector((state)=>state.cart);
  const {user} = useSelector((state)=>state.user);
const subtotal = cartItems.reduce(
  (acc, item) => acc + item.quantity * item.price,
  0
);
const convinenceCharges = 10;
const totalPrice = subtotal+convinenceCharges

const proceedToPayment =()=>{
  const data={
    subtotal,
    convinenceCharges,
    totalPrice,

  }
  sessionStorage.setItem("orderInfo",JSON.stringify(data));
  navigate("/process/payment")
}
  return (
    <>
      <MetaData title="Confirm Booking" />
      <CheckoutStep activeStep={1} />
      <div className="confirmOrderPage">
        <div>
        <div className="confirmshippingArea">
  <Typography>Booking Info</Typography>
  <div className="confirmshippingAreaBox">
    {user && (
      <>
        <div>
          <p>Name:</p>
          <span>{user.name}</span>
        </div>
        <div>
          <p>Phone:</p>
          <span>{bookingInfo.phoneNo}</span>
        </div>
        <div>
          <p>Vehicle Licence number:</p>
          <span>{bookingInfo.licence}</span>
        </div>
      </>
    )}
  </div>
</div>

          <div className="confirmCartItems">
            <Typography>Your Booking:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.parking}>
                    <img src={item.image} alt="Parking" />
                    <Link to={`/parking/${item.parking}`}>{item.name}</Link>
                    <span>
                      {item.quantity} X ₹{item.price}: 
                      <b> ₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* {****} */}
        <div>
          <div className="orderSummary">
            <Typography>Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Convinence Charges:</p>
                <span>₹{convinenceCharges}</span>
              </div>
              
            </div>
            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>
            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmBooking