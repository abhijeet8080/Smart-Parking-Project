const mongoose = require("mongoose");

const parkingSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Parking Name"],
        trim: true
    },
    street: {
        type: String,
        required: [true, "Please Enter Street Address"]
    },
    city: {
        type: String,
        required: [true, "Please Enter City"]
    },
    state: {
        type: String,
        required: [true, "Please Enter State"]
    },
    postal_code: {
        type: Number,
        required: [true, "Please Enter Postal Code"]
    },
    country: {
        type: String,
        required: [true, "Please Enter Country"]
    },
    provider: {
        type: String,
        required: [true, "Please Enter Provider's Name"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please Enter Parking Price"],
        maxLength: [8, "Price Cannot exceed 8 characters"]
    },
    category: {
        type: String,
        enum: ['premium', 'normal'], // Define allowed categories
        default: 'normal' // Set default category
    },
    rating: {
        type: Number,
        default: 0
    },
    parkingSpaces: [
        {
            name: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ['available', 'booked', 'parked'], // Include 'parked' in enum array
                default: 'available'
            }
        }
    ],
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    noOfParkingSpaces: {
        type: Number,
        required: [true, "Please Enter Number of Parking Spaces"],
        maxLength: [4, "Spaces Cannot exceed 4 characters"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                // required: true,
              },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Parking", parkingSchema);
