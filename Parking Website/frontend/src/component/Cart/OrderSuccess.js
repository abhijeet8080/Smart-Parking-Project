import React, { useEffect, useRef } from "react";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { UseSelector, useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { ToastContainer, toast } from "react-toastify";
import "./orderSuccess.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom"
import { createBooking } from "../../store/reducers/bookingSlice";
const OrderSuccess = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))
    const dispatch = useDispatch();
    const {error} = useSelector((state)=>state.booking)
  const {bookingInfo,cartItems} = useSelector((state)=>state.cart);
  const {user} = useSelector((state)=>state.user);
  const booking = {
    bookingInfo,
    bookedParkings:cartItems,
    subtotal:orderInfo.subtotal,
    convinenceCharges:orderInfo.convinenceCharges,
    totalPrice:orderInfo.totalPrice
  }
  const seachQuery = useSearchParams()[0]
  const referenceNum = seachQuery.get("reference")
  
  function addOrder(){
    booking.paymentInfo = {
      id: referenceNum,
      status: "Succeded",
    };
    dispatch(createBooking(booking));
  }

  useEffect(()=>{
    addOrder();
  },[]);
  useEffect(() => {
    if (error) {
      
      toast.success(error);
      
    }
  }, [dispatch, error ]);
  return (
    <>
        <MetaData title={"Order Successful"}/>
      <ToastContainer />
      <div className="h-screen flex items-center justify-center">
      <div className="orderSuccess ">
      <CheckCircleIcon />

      <Typography>Your Order has been Placed successfully </Typography>
      <Typography>Reference No.{referenceNum}</Typography>
      <Link to="/bookings">My Bookings</Link>
    </div>
      </div>
    </>
  )
}

export default OrderSuccess