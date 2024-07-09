const Parking = require("../models/parkingModel");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//Create Parking --Admin
exports.createParking = catchAsyncErrors(async (req, res) => {

  req.body.user = req.user.id;
  const parking = await Parking.create(req.body);
  res.status(201).json({ success: true, parking });
});

//Get All Parking
exports.getAllParkings = catchAsyncErrors(async (req, res, next) => {
  
  const resultPerPage = 6;

  const keyword = req.query.keyword;

  const parkingCount = await Parking.countDocuments();
  const apiFeature = new ApiFeatures(Parking.find(), req.query)
    .search(keyword)
    .filter()
    .pagination(resultPerPage);

    const parkings = await apiFeature.query;

  // Send the response
  res.status(200).json({
    success: true,
    parkings,
    parkingCount, 
    resultPerPage,
  });
});

//Get Parking Details
exports.getParkingDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const parking = await Parking.findById(req.params.id);

    if (!parking) {
      return next(new ErrorHandler("Parking not found", 404));
    }
    res.status(200).json({
      success: true,
      parking,
    });
  } catch (error) {
    next(error); // Pass any errors to the error handler middleware
  }
});

//Update Parking --Admin
exports.updateParking = catchAsyncErrors(async (req, res, next) => {
  try {
    const parkingId = req.params.id;

    // Check if ID is not provided or is not a valid ObjectId
    if (!parkingId || !mongoose.Types.ObjectId.isValid(parkingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing Parking ID in the request",
      });
    }

    let parking = await Parking.findById(parkingId);

    if (!parking) {
      return next(new ErrorHandler("Parking not found", 404));
    }

    parking = await Parking.findByIdAndUpdate(parkingId, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      parking,
    });
  } catch (error) {
    // Handle any errors that occurred during the process
    next(error);
  }
});

exports.deleteParking = catchAsyncErrors(async (req, res, next) => {
  const parking = await Parking.findById(req.params.id);
  if (!parking) {
    return next(new ErrorHandler("Parking not found", 404));
  }

  await parking.deleteOne();
  res.status(200).json({
    success: true,
    message: "Parking deleted Successfully",
  });
});




//Update or Create a Parking review

exports.createParkingReview = catchAsyncErrors(async (req, res, next) => {
  
  const { rating, comment, parkingId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  
  const parking = await Parking.findById(parkingId);

  if (!parking) {
    return res.status(404).json({
      success: false,
      message: "Parking not found",
    });
  }

  const existingReview = parking.reviews.find(rev => rev.user.toString() === req.user._id);

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    // Add new review
    parking.reviews.push(review);
    parking.numberOfReviews = parking.reviews.length;
  }

  // Calculate average rating
  let avg = 0;
  if (parking.reviews.length !== 0) {
    avg = parking.reviews.reduce((total, rev) => total + rev.rating, 0) / parking.reviews.length;
  }

  parking.rating = avg;

  await parking.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});


//Get All reviews of a Parking
exports.getParkingReviews = catchAsyncErrors(async (req, res, next) => {
  const parking = await Parking.findById(req.query.id);

  if (!parking) {
    return next(new ErrorHandler(`Parking not found`));
  }

  res.status(200).json({
    success: true,
    reviews: parking.reviews,
  });
});


//Delete Review
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
  const parking = await Parking.findById(req.query.parkingId);

  if (!parking) {
    return next(new ErrorHandler(`Parking not found`));
  }

  const updatedReviews = parking.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

  // Calculate average rating
  let avg = 0;
  updatedReviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / updatedReviews.length;

  const numberOfReviews = updatedReviews.length;

  await Parking.findByIdAndUpdate(
    req.query.parkingId,
    { reviews: updatedReviews, ratings: ratings, numberOfReviews: numberOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    reviews: updatedReviews,
  });
});

