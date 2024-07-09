import React, { useEffect,useState } from 'react'
import "./Parkings.css"
import { useParams } from 'react-router-dom';

import {useSelector,useDispatch} from "react-redux"
import { getAllParkings } from '../../store/reducers/parkingSlice'
import Loader from '../layout/Loader/Loader'
import ParkingCard from '../Home/ParkingCard'
import Pagination from "react-js-pagination"
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";  
const Parkings = () => {
    const categories = [
        "Premium",
        "Normal"
      ];
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("")
  const [ratings, setRatings] = useState(0)

  const [price, setPrice] = useState([0, 100000]);
    
    const { keyword } = useParams();
    const {loading, parkings, resultPerPage, parkingCount } = useSelector(state => state.parkings);
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
      };
    const setCurrentPageNo = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        dispatch(getAllParkings({ keyword, currentPage,price,category,ratings }));
    }, [dispatch, keyword, currentPage,price,category,ratings]);
    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <h2 className='productsHeading'>Parkings</h2>
                    <div className="products">
                        {parkings && parkings.map((parking) => (
                            <ParkingCard key={parking._id} parking={parking} />
                        ))}
                    </div>
                </>
            )}
            <div className="filterBox ">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={100}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category.toLowerCase())}
                >{category}</li>
              ))}
            </ul>
            <fieldset>
                <Typography component="legend">Ratings Above</Typography>
                <Slider
                    value={ratings}
                    valueLabelDisplay="auto"
                    onChange={(e,newRating)=>{
                        setRatings(newRating);
                    }} 
                        aria-labelledby="continuous-slider"
                        min={0}
                        max={5}
                    />
            </fieldset>
            </div>
            {parkingCount > resultPerPage && (
                <div className="paginationBox" >
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resultPerPage}
                        totalItemsCount={parkingCount}
                        onChange={setCurrentPageNo}
                        nextPageText="Next"
                        prevPageText="Previous"
                        firstPageText="1st"
                        lastPageText="Last"
                        itemClass="page-item"
                        linkClass="page-link"
                        activeClass="pageItemActive"
                        activeLinkClass="pageLinkActive"
                    />
                </div>
            )}
        </>
    );
};

export default Parkings