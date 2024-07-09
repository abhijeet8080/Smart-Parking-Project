const express = require('express');
const {newBooking,myBookings,getSingleBooking,getAllBookings,deleteBooking} = require("../controllers/bookingController")
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route("/booking/new").post(isAuthenticatedUser,newBooking);
router.route("/bookings/me").get(isAuthenticatedUser,myBookings);
router.route("/booking/:id").get(isAuthenticatedUser,getSingleBooking);
router.route("/admin/bookings").get(isAuthenticatedUser,authorizeRoles("admin"),getAllBookings)
router.route("/admin/booking/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteBooking);



module.exports = router;
