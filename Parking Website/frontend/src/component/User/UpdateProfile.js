import React,{useState,useEffect} from 'react'
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import profileImg from "../../images/Profile.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import MetaData from "../layout/MetaData"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { updateProfile,loadUser,resetIsUpdated } from '../../store/reducers/userSlice';
const UpdateProfile = () => {
  const [wait,setWait] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
const { error, isAuthenticated, loading,isUpdated } = useSelector((state) => state.user);
const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profileImg);
  const [imageData, setImageData] = useState({});
  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatar", imageData);

    if (imageData.url && imageData.public_id) {
      formData.append("imageUrl", imageData.url);
      formData.append("publicId", imageData.public_id);
    }

    dispatch(updateProfile(formData));
  };
  const updateProfileDataChange = async (e) => {
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
        setWait(true)
       const response = await axios.post(
          `https://api.cloudinary.com/v1_1/daasrv6ic/image/upload`,
          data
        );
       
        setImageData(response.data);
        

        setWait(false)
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      // Check if user.avatar is defined before accessing url
      if (user.avatar?.url) {
        setAvatarPreview(user.avatar.url);
      }
    }
    if (error) {
      toast.error(error);
    }
    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(loadUser());
      dispatch(resetIsUpdated())
      navigate("/account");
      
    }
  }, [dispatch, error, isUpdated, navigate, user]);

  return (
    <>
      {loading?<Loader />:(<>
      <MetaData title = "Update Profile"/>
      <ToastContainer />
      <div className="updateProfileContainer">
        <div className="updateProfileBox">
          <h2 className="updateProfileHeading">Update Profile</h2>
          <form
            className="updateProfileForm"
            encType="multipart/form-data"
            onSubmit={updateProfileSubmit}
            action=""
          >
            <div className="updateProfileName">
              <SentimentVerySatisfiedIcon />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="updateProfileEmail">
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

            <div id="updateProfileImage">
              <img src={avatarPreview} alt="Avatar Preview" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProfileDataChange}
              />
            </div>
            {wait?<> <Box sx={{ display: 'flex', alignItems: "center", justifyContent:"center"}}>
      <CircularProgress />
    </Box></> :<input
              type="submit"
              value="Update"
              className="updateProfileBtn"
            />}
          </form>
        </div>
      </div>
    </>)}
    </>
  )
}

export default UpdateProfile