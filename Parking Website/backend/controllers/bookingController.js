const Booking = require("../models/bookingModel");
const Parking = require("../models/parkingModel");

const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");



exports.newBooking = catchAsyncErrors(async (req, res, next) => {
    console.log("new create booking is called");
    console.log("first");
    const {
        bookingInfo,
        bookedParkings,
        subtotal,
        convinenceCharges,
        totalPrice,
        paymentInfo,
        status,
    } = req.body;
    console.log(bookedParkings)
    // Extracting selected parking spaces from bookedParkings array
    const selectedParkingSpaces = bookedParkings.reduce((acc, curr) => {
        // Check if selectedParkingSpaces exists and is an array in the current booked parking item
        if (Array.isArray(curr.selectedParkingSpaces) && curr.selectedParkingSpaces.length > 0) {
            // Push each selected parking space into the accumulator array
            acc.push(...curr.selectedParkingSpaces);
        }
        return acc;
    }, []);

    console.log(selectedParkingSpaces);
    
    try {
        console.log("second");
        // Create a new instance of Booking model
        const booking = new Booking({
            bookingInfo,
            bookedParkings,
            subtotal,
            convinenceCharges,
            totalPrice,
            paymentInfo,
            status,
            selectedParkingSpaces, // Include selectedParkingSpaces in the booking
            user: req.user._id, // Assuming req.user._id contains the user ID
        });

        console.log("third");
        const existingOrder = await Booking.findOne({ paymentInfo });
        if (existingOrder) {
            console.log("Order already exists for this paymentInfo");
            return next(new ErrorHandler('Order already exists for this paymentInfo', 400));

        }
        try {
            for (const parking of bookedParkings) {
                const parkingDoc = await Parking.findById(parking.parking);
                console.log(parkingDoc)
                if (!parkingDoc) {
                    console.log("Parking not found")
                    return next(new ErrorHandler('Parking not found', 404));
    
                }
                for (const selectedSpace of parking.selectedParkingSpaces) {
                    console.log("second for loop")
                    const spaceIndex = parkingDoc.parkingSpaces.findIndex(space => space.name === selectedSpace);
                    if (spaceIndex !== -1) {
                        parkingDoc.parkingSpaces[spaceIndex].status = "booked";
                    }
                }
                parkingDoc.user = req.user._id; // Assigning the user ID to the parking document
                await parkingDoc.save();
            }
        } catch (error) {
            console.log(error)
        }
        await booking.save();
        console.log("forth");

        res.status(201).json({ success: true, booking });
    } catch (error) {
        return next(new ErrorHandler('Error in creating booking', 500));
    }
});












//Get booking Details
exports.getSingleBooking = catchAsyncErrors(async(req,res,next)=>{
    const booking = await Booking.findById(req.params.id).populate("user","name email");

    if(!booking){
        return next(new ErrorHandler("Booking not found with this Id",404));
    }

    res.status(200).json({
        success:true,
        booking
    })
})


//Get Logged In user orders

exports.myBookings = catchAsyncErrors(async (req, res, next) => {
    if (!req.user || !req.user._id) {
        return next(new ErrorHandler("User not authenticated", 401));
    }
    const myBookings = await Booking.find({ user: req.user._id });
    console.log(myBookings)
    res.status(200).json({
        success: true,
        myBookings
    });
});

//Get All Orders
exports.getAllBookings = catchAsyncErrors(async (req, res, next) => {
    
    const bookings = await Booking.find();

    let totalAmount = 0;
    bookings.forEach(booking=>{
        totalAmount += booking.totalPrice;
    });


    res.status(200).json({
        success: true,
        bookings,
        totalAmount
    });
});

//Delete Booking
exports.deleteBooking = catchAsyncErrors(async (req, res, next) => {
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return next(new ErrorHander("booking not found with this Id", 404));
      }

    await booking.deleteOne()

    res.status(200).json({
        success: true,
       
    });
});



// // // Validate input data
// if (!bookingInfo || !bookedParkings || !subtotal || !convinenceCharges || !totalPrice || !paymentInfo) {
//     return res.status(400).json({ success: false, message: 'Missing required fields' });
// }
// console.log("first")
// console.log(req.user._id);
// try {
//     const booking = await Booking.create({
//         bookingInfo,
//         bookedParkings,
//         subtotal,
//         convinenceCharges,
//         totalPrice,
//         paymentInfo,
//         status: status || 'Pending', 
//         user: req.user._id, 
//     });
//     console.log("second")
//     res.status(201).json({ success: true, booking });
// } catch (error) {
//     return next(new ErrorHandler('Error in creating booking', 500));
// }