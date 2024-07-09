import React, {useState} from 'react'
import "./Header.css"
import DashboardIcon from "@mui/icons-material/Dashboard";
import { logOut } from '../../../store/reducers/userSlice';
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {  useDispatch,useSelector } from "react-redux";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import { CiShoppingCart } from "react-icons/ci";
import Backdrop from '@mui/material/Backdrop';

const UserOptions = ({user}) => {
  const {cartItems} = useSelector((state)=>state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const options = [
    { icon: <ListAltIcon />, name: "Bookings", func: bookings },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <CiShoppingCart style={{color:'tomato'}} />, name: `Cart(${cartItems.length})`, func: cart },
    { icon: <ExitToAppIcon />, name: "Logout", func: LogoutUser },
  ];
  function dashBoard() {
    navigate("/dashboard");
  }
  function bookings() {
    navigate("/bookings");
  }
  function account() {
    navigate("/account");
  }
  function cart() {
    navigate("/cart");
  }
  async function LogoutUser(){
    try {
        await dispatch(logOut()); 
        toast.success("Logout Successfully"); 
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed"); 
      }
  }
  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "DashBoard",
      func: dashBoard,
    });
  }
  return (
    <>
        <Backdrop open={open} style={{zIndex:10}}/>
        <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : <PersonIcon />}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth<=600?true:false}
          />
        ))}
      </SpeedDial>
    </>
  )
}

export default UserOptions

