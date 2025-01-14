//Creating Token and saving in cookie


const sendToken =(user,statusCode,res)=>{
    const token = user.getJWTToken();
    //Options for Cookie
    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'None', // Add SameSite attribute
      secure: true,     // Recommended for cross-site cookies
  };
    res.status(statusCode).cookie('token',token,options).json({success:true,user,token});
}

module.exports = sendToken;