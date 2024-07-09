import React from 'react'
import "./CartItemCard.css"
import { Link } from 'react-router-dom'
const CartItemCard = ({item,deleteCartItems}) => {
  return (
    <div className="CartItemCard">
        <img src={item.image} alt="asdfsdf" />
        <div>
            <Link to={`/parking/${item.parking}`}>{item.name}</Link>
            <span>{`Price: ${item.price}`}</span>
            <p onClick={()=>{deleteCartItems(item.parking)}}>Remove</p>
        </div>
    </div>
  )
}

export default CartItemCard