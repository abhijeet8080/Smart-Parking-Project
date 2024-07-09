import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Header from "./component/layout/Header/Header.js"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebFont from 'webfontloader';
import Footer from './component/layout/Footer/Footer.js';
import Home from './component/Home/Home .js';
import Nopage from './component/Nopage/Nopage.js';
import ParkingDetails from "./component/Parking/ParkingDetails.js"
import Parkings from "./component/Parking/Parkings.js"
import Search from "./component/Parking/Search.js"
import LoginSignup from './component/User/LoginSignup.js';
import { useDispatch, useSelector } from 'react-redux';
import UserOptions from './component/layout/Header/UserOptions.js';
import {store} from "./store/store.js"
import { loadUser } from './store/reducers/userSlice.js';
import Profile from './component/User/Profile.js';
import UpdateProfile from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPassword.js';
import Cart from './component/Cart/Cart.js';
import Booking from './component/Cart/Booking.js';
import ConfirmBooking from './component/Cart/ConfirmBooking.js';
import Payment from './component/Cart/Payment.js';
import OrderSuccess from './component/Cart/OrderSuccess.js';
import MyOrders from './component/Order/MyOrders.js';
import BookingDetails from './component/Order/BookingDetails.js';
import Aboutus from './component/About/Aboutus.js';
import ProtectedRoute from './component/Route/ProtectedRoute.js';



const App = () => {


  const { isAuthenticated, user } = useSelector(state => state.user)
  const [razorPayApiKey, setRazorPayApiKey] = useState("");

  async function getRazorPayApiKey() {
    try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include token in the Authorization header
            },
        };

        const { data } = await axios.get(`http://localhost:4000/api/v1/razorpayapi`);
        console.log(data);
        setRazorPayApiKey(data.key);
        localStorage.setItem('razorPayApiKey', data.key); 
    } catch (error) {
        console.error('Error fetching Razorpay API key:', error);
    }
}
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    if(isAuthenticated){
      getRazorPayApiKey();
    }
  }, []);
  return (
    <BrowserRouter>
      <Header />
      {isAuthenticated&&<UserOptions user={user}/>}
      <Routes>
      
        <Route path='/' element={<Home />}/>
        <Route path="/parking/:id" element={<ParkingDetails />} />
        <Route path="/parkings" element={<Parkings />} />
        <Route path="/parkings/:keyword" element={<Parkings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/me/update" element={<UpdateProfile />} />
        <Route path="/password/update" element={<UpdatePassword />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path='/password/reset/:token' element={<ResetPassword />} />
        <Route path='/cart' element={<Cart />} />
        <Route exact path="/booking" element={<Booking />} />
          <Route path='/booking/confirm' element={<ConfirmBooking  />} />
        <Route path='/process/payment' element={<Payment  />} />
        <Route path='/success' element={<OrderSuccess  />} />
        <Route path='/bookings' element={<MyOrders  />} />
        <Route path='/booking/:id' element={<BookingDetails  />} />
        <Route path='/aboutus' element={<Aboutus  />} />
        aboutus


        <Route path="*" element={<Nopage/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
