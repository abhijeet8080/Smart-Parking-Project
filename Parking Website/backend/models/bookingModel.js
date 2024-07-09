const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    bookingInfo: {
        datestr: {
            type: String,
            required: true,
        },
        timestr: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        },
        licence: {
            type: String,
            required: true,
        },
    },
    bookedParkings: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            parking: {
                type: mongoose.Schema.ObjectId,
                ref: "Parking",
                required: true,
            },
            selectedParkingSpaces: [String], // Update to array of strings
        },
    ],
    selectedParkingSpaces: [String], // Update to array of strings
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    convinenceCharges: {
        type: Number,
        required: true,
        default: 0,
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
