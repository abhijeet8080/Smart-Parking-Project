import React, { useState, useEffect } from "react";
import "./Booking.css"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { format, isBefore } from 'date-fns';
import { TbLicense } from "react-icons/tb";
import TimePicker from 'react-time-picker';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutStep from "./CheckoutSteps";
import MetaData from '../layout/MetaData';
import { saveBookingInfo } from "../../store/reducers/cartSlice";
import { parse } from 'date-fns';
import PhoneIcon from "@mui/icons-material/Phone";
export default function Booking() {
  const dispatch = useDispatch();
  const navigate= useNavigate();
  const { bookingInfo } = useSelector((state) => state.cart);
  const [phoneNo, setPhoneNo] = useState(bookingInfo.phoneNo);
  const [licence, setLicence] = useState(bookingInfo.licenceNo);
  const [date, setDate] = useState(new Date()); 
  const [time, setTime] = useState(new Date()); 
  const [datestr, setDatestr] = useState(""); 
  const [timestr, setTimestr] = useState(""); 
  const [dateWarning, setDateWarning] = useState(""); 


  
  useEffect(() => {
    
    if (datestr && isBefore(new Date(datestr), new Date())) {
      setDateWarning("Selected date is in the past");
    } else {
      setDateWarning("");
    }
  }, [datestr]);

  const handleDateChange = (newDate) => {
    const dateString = format(newDate, 'yyyy-MM-dd'); // Format newDate as 'YYYY-MM-DD'
    setDatestr(dateString);
    setDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime)
    const parsedTime = parse(newTime, 'HH:mm', new Date());
    if (!isNaN(parsedTime.getTime())) {
      const formattedTime = format(parsedTime, 'hh:mm a'); // Format parsedTime as 'hh:mm a' (12-hour format with AM/PM)
      setTimestr(formattedTime);
    } else {
      console.error('Invalid time value:', newTime);
    }
  };

  const bookingSubmit = (e) => {
    e.preventDefault();
    if(phoneNo.length<10||phoneNo.length>10){
      toast.error("Phone Number should be 10 digits Long")
      return;
  }
    if (dateWarning) {
      toast.error(dateWarning);
      return;
    }
    dispatch(saveBookingInfo({ datestr, timestr,phoneNo,licence }));
    navigate("/booking/confirm")
  }

  return (
    <>
      <ToastContainer />
      <MetaData title="Booking Details"/>
      
        <CheckoutStep activeStep={0}/>
        <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Booking Details</h2>
          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={bookingSubmit}
            action=""
          >
          <div>
              <PhoneIcon />
              <input
                type="text"
                placeholder="Phone No"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            <div>
            <TbLicense />
              <input
                type="text"
                placeholder="Vehicle Licence Number"
                required
                value={licence}
                onChange={(e)=>setLicence(e.target.value)}
                
              />
            </div>
            <div className="flex-col justify-start items-start font-roboto text-blue-gray-200 mt-0" style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: '1.3vmax' }}>
  <p className="text-base">Arrive Date</p>
  <DatePicker className="p-[1vmax] px-[4vmax] pr-[1vmax] w-full box-border border border-gray-300 rounded-md font-light text-[0.9vmax] font-cursive outline-none" onChange={handleDateChange} value={date}/>
</div>

<div className="flex-col justify-start items-start font-roboto text-blue-gray-200 mb-6" style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: '1.3vmax' }}>
  <p className="text-base text-start">Arrive Time</p>
  <TimePicker className="p-[1vmax] px-[4vmax] pr-[1vmax] w-full box-border border border-gray-300 rounded-md font-light text-[0.9vmax] font-cursive outline-none" onChange={handleTimeChange} value={time} />
  </div>
            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              
            />
          </form>
        </div>
      </div>
      
    </>
  );
}



