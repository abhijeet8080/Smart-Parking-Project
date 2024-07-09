import React from 'react'
import ReactStars from "react-rating-stars-component"
import profilePng from "../../images/Profile.png"
const Reviewcard = ({review}) => {
    const options={
        edit:false,
        color:"tomato",
        activeColor:"red",
        size:window.innerWidth<600?20:25,
        value:review.rating,
        isHalf:true
    }
  return (
    <div className='reviewCard'>
        <img src={profilePng} alt="user" />
        <p>{review.name}</p>
        <ReactStars {...options} />
        <span>{review.comment}</span>

    </div>
  )
}

export default Reviewcard