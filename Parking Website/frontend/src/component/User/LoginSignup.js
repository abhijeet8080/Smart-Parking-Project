import React, { useRef, useState, useEffect } from "react";
import "./LoginSignup.css"; // Corrected CSS file path
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email"; // Import corrected icon names
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import profileImg from "../../images/Profile.png";
import { login, register } from "../../store/reducers/userSlice";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import axios from "axios";
const LoginSignUp = ({ location }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, loading } = useSelector((state) => state.user);
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [imageData,setImageData] = useState({})
  const [wait,setWait] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profileImg);

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: loginEmail, password: loginPassword }));
  };
  

  const registerSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar); // Use the avatar state variable here
    if (imageData.url && imageData.public_id) {
      formData.append("imageUrl", imageData.url); // Append URL to form data
      formData.append("publicId", imageData.public_id); // Append public ID to form data
    }
    dispatch(register(formData));
  };

  const registerDataChange = async (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setAvatar(file);
          setAvatarPreview(reader.result);
        };
        
        reader.readAsDataURL(file);
  
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "avatars_preset");
        data.append("cloud_name", "daasrv6ic");
  
        try {
          setWait(true);
          const response = await axios.post(`https://api.cloudinary.com/v1_1/daasrv6ic/image/upload`, data);
          
          setImageData(response.data); // Setting the state here
          
          setWait(false)
        } catch (error) {
          console.error("Error uploading image:", error);
          // You might want to show a notification or handle the error in some other way
        }
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const redirect = location?.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, isAuthenticated, navigate, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");
      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ToastContainer />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <EmailIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
                action=""
              >
                <div className="signUpName">
                  <SentimentVerySatisfiedIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <EmailIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  /> 
                </div>
                <div id="registerImage">
                  <img className="profileImage" src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                {wait?<> <Box sx={{ display: 'flex', alignItems: "center", justifyContent:"center"}}>
                <CircularProgress />
                   </Box></> :<input
                    type="submit"
                    value="Update"
                    className="signUpBtn"
            />}
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginSignUp;
