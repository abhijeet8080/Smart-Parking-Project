import React, { useEffect, useRef, useState } from "react";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../layout/Loader/Loader";
import "./Payment.css"
const Payment = () => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
    const { bookingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const payBtn = useRef(null);
    const paymentData = {
      amount: Math.round(orderInfo.totalPrice * 100),
    };
    const order = {
      bookingInfo,
      orderItems: cartItems,
      itemsPrice: orderInfo.subtotal,
      conviencePrice: orderInfo.convinenceCharges,
      totalPrice: orderInfo.totalPrice,
    };
 
    const checkoutHandler = async (amount) => {
      payBtn.current.disabled = true;
      setLoading(true);
      try {


        const { data: { order } } = await axios.post("http://localhost:4000/api/v1/payment/checkout", {
          amount
        });
        const key = localStorage.getItem('razorPayApiKey');
        if (!key) {
          console.error('Razorpay API key is missing');
          return;
        }
       
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "ParkSafe",
          description: "Find a Safe Parking For Your Vehicle",
          order_id: order.id,
          image: user.avatar.url,
          callback_url: "http://localhost:4000/api/v1/payment/paymentVerification",
          prefill: {
            name: user.name,
            email: user.email,
            contact: bookingInfo.phoneNo
          },
          notes: {
            address: `Parksafe Office, Pathardi`
          },
          theme: {
            color: "#121212"
          }
        };
        setLoading(false);
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error('Error in checkout:', error);
      }
    };
  return (
    <>
          {loading ? (
            <Loader />
          ) : (
            <div className="body h-screen w-full flex items-center justify-center">
             
              <button type="button" ref={payBtn}
                className="Paymentbtn w-full h-full text-black items-center flex justify-center"
                onClick={() => checkoutHandler(paymentData.amount)}>
                  <strong>Click here to Pay ₹{orderInfo && orderInfo.totalPrice}</strong>
                   <div id="container-stars">
                  <div id="stars"></div>
                   </div>

                  <div id="glow">
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
</button>

            </div>
          )}
        </>
  )
}

export default Payment