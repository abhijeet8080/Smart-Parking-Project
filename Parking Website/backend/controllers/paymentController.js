const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { instance } = require("../razorpay");
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
const crypto = require('crypto');
const Payment = require("../models/payment"); 



exports.checkout = catchAsyncErrors(async (req, res, next) => {
    console.log("This is called")
    console.log(req.body.amount);
    const amountInPaise = Number(req.body.amount);
    const options = {
        amount: amountInPaise,
        currency: "INR",
    };
    try {
        const order = await instance.orders.create(options);
        console.log(order);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to create booking" });
    }
});

exports.paymentVerification = catchAsyncErrors(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    try {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            console.log("Payment successfully verified");
            res.redirect(`http://localhost:3000/success?reference=${razorpay_payment_id}`);
        } else {
            res.status(400).json({ success: false, error: "Invalid signature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

exports.sendRazorPayApiKey = catchAsyncErrors(async (req, res, next) => {
    try {
        res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to send Razorpay API key" });
    }
});