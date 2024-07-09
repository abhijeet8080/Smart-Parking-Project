import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from '@mui/icons-material/Lock';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/reducers/userSlice"; // Import resetPassword action creator
import MetaData from "../layout/MetaData";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    const { error, success, loading } = useSelector((state) => state.user);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        

        // Dispatch the resetPassword action creator with token and formData
        dispatch(resetPassword({ token, password }));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (success) {
            toast.success("Password Updated Successfully");
            navigate("/login"); // Navigate to the login page after successful password reset
        }
    }, [dispatch, error, success, navigate]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Change Password" />
                    <ToastContainer />
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className="resetPasswordHeading">Change Password</h2>
                            <form
                                className="resetPasswordForm"
                                encType="multipart/form-data"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div className="signUpPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    value="Update"
                                    className="resetPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ResetPassword;
