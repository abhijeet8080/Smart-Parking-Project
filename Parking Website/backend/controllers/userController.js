const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const crypto = require("crypto");

const Parking = require("../models/parkingModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
//Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  
  
  
  const { name, email, password,imageUrl,publicId} = req.body;

 
  

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: publicId,
      url: imageUrl,
    },
  });
  
  sendToken(user,200,res);
});


//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter email and password"), 400);
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password"), 401);
    }
    const token = user.getJWTToken()
  
    sendToken(user, 201, res);  
  });
  

  //LogOut User

exports.logOut = catchAsyncErrors(async (req, res, next) => {
  
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  //Get Reset Password Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token temp is  :- \n\n ${resetPasswordUrl}  \n\nIf you have not requested this email then please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Park Safe Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});


//Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  console.log("Reset Password is called");

  // Extracting password and confirmPassword from FormData
  const password = req.body.password

  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  
  
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});


//Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  

  const user = await User.findById(req.user.id).select("+password");
  
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Check if new password and confirm password match
  if (req.body.newPassword !== req.body.confirmPassword) {

    return next(
      new ErrorHandler("New password and confirm password do not match", 400)
    );
  }

  // Update the password
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});


//Update User profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.publicId && req.body.imageUrl) {
    newUserData.avatar = {
      public_id: req.body.publicId,
      url: req.body.imageUrl,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // Move the sendToken function inside the catch block
  sendToken(user, 200, res);

  // Send a response after the sendToken function
  
});


exports.getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//Get Single User
exports.getSingleUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exists with id ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Role
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  // Check if the user exists before updating
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update the user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // Send a response
  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});


//Delete User Role
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id ${req.params.id}`)
    );
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted Successfully",
  });
});

