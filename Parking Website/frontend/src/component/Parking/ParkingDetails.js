import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getParkingDetails } from '../../store/reducers/parkingSlice';
import Loader from '../layout/Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Carousel from "react-material-ui-carousel";
import { addItemsToCart } from '../../store/reducers/cartSlice';

import ReactStars from "react-rating-stars-component";
import MetaData from "../layout/MetaData"
import "./ParkingDetails.css";
import Reviewcard from './ReviewCard';

const ParkingSpaces = memo(({ parkingSpaces, selectedParkingSpaces, handleParkingSpaceClick }) => {
  return (
    <div>
    <h1>Available Spaces:</h1>
      {parkingSpaces && parkingSpaces
        .filter(parkingSpace => parkingSpace.status === 'available') // Filter parking spaces with status 'available'
        .map((parkingSpace) => (
          <button
            className={`p-5 text-white m-2 rounded-lg ${
              selectedParkingSpaces.includes(parkingSpace.name)
                ? 'bg-blue-500' // Change the button color if parking space is selected
                : 'bg-green-500' // Default button color
            }`}
            key={parkingSpace._id}
            onClick={() => handleParkingSpaceClick(parkingSpace.name)}
          >
            {parkingSpace.name}
          </button>
        ))}
    </div>
  );
});

const ParkingDetails = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { parkingDetails, loading, error } = useSelector(state => state.parkings);
  const [quantity, setQuantity] = useState(1);
  const [selectedParkingSpaces, setSelectedParkingSpaces] = useState([]);

  const handleParkingSpaceClick = (parkingSpaceName) => {
    setSelectedParkingSpaces(prevSpaces => {
      if (prevSpaces.includes(parkingSpaceName)) {
        // If already selected, remove it from the array
        return prevSpaces.filter(space => space !== parkingSpaceName);
      } else {
        // If not selected, add it to the array
        return [...prevSpaces, parkingSpaceName];
      }
    });
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    // Check if any parking space is selected
    if (selectedParkingSpaces.length === 0) {
      toast.error("Please select at least one parking space");
      return; // Prevent further execution
    }
    // Dispatch action to add selected parking spaces to the cart
    dispatch(addItemsToCart({ id, selectedParkingSpaces }))
    toast.success("Parking Added To Bucket");
    navigate("/cart")
  }

  const options = {
    edit: false,
    color: "gray",
    activeColor: "red",
    size: window.innerWidth < 600 ? 20 : 25,
    value: parkingDetails?.rating || 0,
    isHalf: true
  };

  useEffect(() => {
    dispatch(getParkingDetails(id));
    const interval = setInterval(() => {
      dispatch(getParkingDetails(id));
    }, 10000); 
    return () => clearInterval(interval);
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading || !parkingDetails) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={`${parkingDetails.name}`} />

      {loading ? <Loader /> :
        <>
          <ToastContainer />

          <div className="ProductDetails ">
            <div className="imageCarousel sm:w-[100%]">
              <Carousel>
              <img
                      className="CarouselImage "
                      key={parkingDetails.images[1].url}
                      src={parkingDetails.images[1].url}
                      alt={`Video Slide`}
                    />
                
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1 border-b-[1px] border-black-rgba w-[27.5vw] ">
                <h2>{parkingDetails.name}</h2>
                <p className='mt-2'>Parking #{parkingDetails._id}</p>
              </div>
              <div className='font-sans my-1'>
                Category: {parkingDetails.category === 'premium' ? "Premium" : "Normal"}
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} /><span>({parkingDetails.numOfReviews} reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${parkingDetails.price}`}</h1>
                <div className="detailsBlock-3-1 flex-col items-start justify-start">
                  <ParkingSpaces
                    parkingSpaces={parkingDetails.parkingSpaces}
                    selectedParkingSpaces={selectedParkingSpaces}
                    handleParkingSpaceClick={handleParkingSpaceClick}
                  />
                  <button onClick={addToCartHandler}>Book Parking Now</button>
                </div>
                <p>
                  Status:
                  <b className={parkingDetails.noOfParkingSpaces < 1 ? "redColor" : "greenColor"}>
                    {parkingDetails.noOfParkingSpaces < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="font-thin text-sm  border-b-[1px] border-black-rgba w-[27.5vw]">
                Provider : <span className='font-thin text-gray-800'> {parkingDetails.provider}</span>
              </div>
              <div className="font-thin text-sm  mt-3 border-b-[1px] border-black-rgba w-[27.5vw]">
                Address : <span className='font-thin text-gray-800'>{parkingDetails.street}, {parkingDetails.city}, {parkingDetails.postal_code}, {parkingDetails.country}</span>
              </div>
              <button className="submitReview">Submit Review</button>
            </div>
          </div>
          <h3 className="reviewsHeading">Reviews</h3>
          {parkingDetails.reviews && parkingDetails.reviews[0] ? (
            <div className="reviews">
              {parkingDetails.reviews.map((review) => <Reviewcard key={review._id} review={review} />)}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>}
    </>
  );
});

export default ParkingDetails;
