const express = require('express');
const { getAllParkings,createParking, updateParking,deleteParking, getParkingDetails,createParkingReview ,getParkingReviews,deleteReviews} = require('../controllers/parkingController');
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Define routes
router.route("/parking").get(getAllParkings);
router
  .route("/admin/parking/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createParking);
  router
  .route("/admin/parking/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateParking);
  router.route("/parking/:id").get(getParkingDetails);

  router
  .route("/admin/parking/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteParking);
  router.route("/review").put(isAuthenticatedUser, createParkingReview);
  router.route("/reviews").get(getParkingReviews).delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
