import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {  forgotPassword, resetMessage } from "../../store/reducers/userSlice";
import MetaData from "../layout/MetaData"
const ForgotPassword = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message, loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("")


  const forgotPasswordSubmit = (e) => {
    e.preventDefault(); 
    const formData = new FormData();
    formData.set("email",email);

    dispatch(forgotPassword(email));
  };


  useEffect(() => {
    
    if (error) {
      toast.error(error);
    }
    if (message) {
        
        toast.success(message);
        
      }
  }, [dispatch, error, navigate,message]);
  return (
    <>
        {loading?<Loader />:(<>
      <MetaData title = "Forgot Password"/>
      <ToastContainer />
      <div className="forgotPasswordContainer">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Forgot Password</h2>
          <form
            className="forgotPasswordForm"
            onSubmit={forgotPasswordSubmit}
            action=""
          >
            
            <div className="forgotPasswordEmail">
              <EmailIcon />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            
            <input
              type="submit"
              value="Send"
              className="forgotPasswordBtn"
            />
          </form>
        </div>
      </div>
    </>)}
    </>
  )
}

export default ForgotPassword