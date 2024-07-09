const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter your name"],
        maxLength : [30, "Name cannot exceed 30 Characters"],
        minLength : [4, "Name cannot less than 4 Characters"]
    },
    email:{
        type:String,
        required:[true, "Please Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Valid Email"]
    },
    password:{
        type:String,
        required:[true, "Please Enter your name"],
        minLength : [8, "Password should be greater than 8 characters"],
        select:false

    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    parking:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Parking"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

//JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}
//Compare Password
//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) {
        return false; // Return false if the user doesn't have a password (user not found)
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token

userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
     
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

module.exports = mongoose.model("User",userSchema);

