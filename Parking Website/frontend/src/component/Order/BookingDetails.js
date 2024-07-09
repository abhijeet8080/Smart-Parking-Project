
import React, { Fragment, useEffect } from "react";
import "./BookingDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import Typography from '@mui/material/Typography';
import { getOrderDetails } from "../../store/reducers/bookingSlice";
import { ToastContainer,toast } from "react-toastify";
const BookingDetails = () => {
  const {id} = useParams();
  console.log(id)
  const { bookingDetails, error, loading } = useSelector((state) => state.booking);
  console.log(bookingDetails)
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);
  return (
    <>
      {loading?<Loader/>:(
        <>
        <ToastContainer/>
        <MetaData title="Booking Details"/>
        <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">
                 Booking #{bookingDetails._id}
              </Typography>
              <Typography>Booking Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{bookingDetails.user&&bookingDetails.user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>{bookingDetails.bookingInfo&&bookingDetails.bookingInfo.phoneNo}</span>
                </div>
                <div>
                  <p>Vehicle Licence No:</p>
                  <span>{bookingDetails.bookingInfo&&bookingDetails.bookingInfo.licence}</span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                <p
                    className={
                      bookingDetails.paymentInfo &&
                      bookingDetails.paymentInfo.status === "Succeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {bookingDetails.paymentInfo &&
                      bookingDetails.paymentInfo.status === "Succeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>
                <div>
                <p>Amount:</p>
                  <span>{bookingDetails.totalPrice && bookingDetails.totalPrice}</span>
                </div>
              </div>
              <Typography>Booking Status</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                <p
                    className={
                      bookingDetails.status && bookingDetails.status === "Completed"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {bookingDetails.status && bookingDetails.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="orderDetailsCartItems">
              <Typography>Order Items:</Typography>
              <div className="orderDetailsCartItemsContainer">
                {bookingDetails.bookedParkings &&
                  bookingDetails.bookedParkings.map((item) => (
                    <div key={item.parking}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/parking/${item.parking}`}>
                        {item.name}
                      </Link>
                      <span>
                        {item.quantity} X ₹{item.price} ={" "}
                        <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
        </div>
        </>
      )}
    </>
  )
}

export default BookingDetails