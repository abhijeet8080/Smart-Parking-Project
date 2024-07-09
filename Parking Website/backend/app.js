const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const errorMiddleware = require("./middleware/error")
dotenv.config({ path: "backend/config/config.env" });

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const parking = require("./routes/parkingRoute");
const user = require("./routes/userRoute");
const booking = require("./routes/bookingRoute");
const payment = require('./routes/paymentRoutes');

app.use("/api/v1", parking);
app.use("/api/v1", user);
app.use("/api/v1", booking);
app.use("/api/v1", payment);


//Middleware for error 
app.use(errorMiddleware);

module.exports = app;
