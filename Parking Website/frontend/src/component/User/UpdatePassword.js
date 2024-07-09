import React,{useState, useEffect} from 'react'
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData"
import { updatePassword,loadUser,resetIsUpdated  } from '../../store/reducers/userSlice';
const UpdatePassword = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isUpdated, loading } = useSelector((state) => state.user || {});
  const [oldPassword , setOldPassword ] = useState("");
  const [newPassword , setNewPassword ] = useState("");
  const [confirmPassword , setConfirmPassword ] = useState("");
  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const formData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };

    dispatch(updatePassword(formData)); 
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      navigate("/account");
      dispatch(loadUser());
      dispatch(resetIsUpdated())
      navigate("/account");
    }
  }, [dispatch, error, isUpdated, navigate]);
  return (
    <>
        {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Change Password" />
          <ToastContainer />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Change Password</h2>
              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
                action=""
              >
                <div className="signUpPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="signUpPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
    
export default UpdatePassword