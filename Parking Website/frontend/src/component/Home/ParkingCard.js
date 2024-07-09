import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component"
import "./Home.css"
  export default function  ParkingCard({parking}) {
    const options={
      edit:false,
      color:"gray",
      activeColor:"red",
      size:window.innerWidth<600?20:25,
      value:parking.rating,
      isHalf:true
  }
    return (
      <>
      <Link className='productCard' to={`/parking/${parking._id}`}>
        <img src="https://th.bing.com/th/id/OIP.cc3E8aXLb_mcPEBiWIiclwHaE8?rs=1&pid=ImgDetMain" alt="" />
        <p>{parking.name}</p>
        <div>
            <ReactStars {...options} /><span>({parking.numOfReviews} reviews)</span>
        </div>
        <span>{`₹${parking.price}`}</span>
    </Link>
        
      </>
    );
  }