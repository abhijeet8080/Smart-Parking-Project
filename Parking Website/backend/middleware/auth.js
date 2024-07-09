const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User= require("../models/userModel");


// exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
//         console.log("isAuthenticateUser is called");
//         console.log(req.cookies.token); // Check if the token is available in cookies
    
//         const { token } = req.cookies; // Get the token from cookies
    
//         if(!token){
//             return next(new ErrorHander("Please Login to access this resource",401));
//         }
    
//         try {
//             const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decodedData.id);
//             next();
//         } catch (error) {
//             return next(new ErrorHander("Invalid Token. Please login again.",401));
//         }
//     });
    
exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        console.log("isAuthenticatedUser is called");

        // Get the token from the Authorization header
        const token = req.headers.authorization;
        
        // Check if token exists
        if (!token || !token.startsWith("Bearer ")) {
            throw new ErrorHandler("Please Login to access this resource", 401);
        }

        // Extract token from header
        const authToken = token.split(" ")[1];

        // Verify token
        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await User.findById(decodedData.id);

        // Check if user exists
        if (!user) {
            throw new ErrorHandler("Invalid Token. Please login again.", 401);
        }

        // Attach user to request object
        req.user = user;
       
        // Proceed to the next middleware
      
        next();
    } catch (error) {
        return next(error);
    }
};

  
exports.authorizeRoles = (...roles)=>{


    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Role :${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    }
}

