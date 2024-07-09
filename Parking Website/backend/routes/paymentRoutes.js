const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {checkout, sendRazorPayApiKey,justCall,processPayment,paymentVerification } = require("../controllers/paymentController");


router.route("/payment/checkout").post( checkout );
router.route("/payment/paymentVerification").post( paymentVerification );
router.route("/razorpayapi").get( sendRazorPayApiKey);


module.exports = router;

