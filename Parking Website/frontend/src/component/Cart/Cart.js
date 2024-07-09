import React from 'react'
import "./Cart.css"
import CartItemCard from "./CartItemCard.js"
import {useSelector, useDispatch} from "react-redux"
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom'
import { addItemsToCart, removeItemFromCart } from '../../store/reducers/cartSlice.js';
import { ToastContainer, toast } from 'react-toastify';
const Cart = () => {
    const navigate= useNavigate();
    const dispatch = useDispatch();
    const {cartItems} = useSelector((state)=>state.cart);
    
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const increaseQuantity = (id, quantity, noOfParkingSpaces) => {
       
        const newQty = quantity + 1;
        if (noOfParkingSpaces <= quantity) {
            return;
        }
        dispatch(addItemsToCart({ id, quantity: newQty })); // Use quantity: newQty to pass the new quantity
    }
    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (1 >= quantity) {
            return;
        }
        dispatch(addItemsToCart({ id, quantity: newQty })); // Use quantity: newQty to pass the new quantity
    }
    const deleteCartItems=(id)=>{
        dispatch(removeItemFromCart(id));
    }
    const checkoutHandler = () => {
        if (isAuthenticated) {
            navigate("/booking");
        } else {
            navigate("/login?redirect=shipping");
        }
    }
  return (
    <><ToastContainer />
        {cartItems.length===0?<>
            <div className='h-screen flex items-center justify-center'>
            <div className='emptyCart   h-96'>
                <RemoveShoppingCartIcon />
                <Typography>No Parkings in Your Cart</Typography>
                <Link to="/parkings">View Parkings</Link>
            </div>
            </div>
        </>:(<>
        <div className='cartPage h-screen'>
            <div className="cartHeader">
                <p>Parkings</p>
                <p>Spaces</p>
                <p>Subtotal</p>
            </div>
            
        {cartItems&&cartItems.map((item)=>(
            <div className="cartContainer" key={item.product}>
                <CartItemCard item={item} deleteCartItems={deleteCartItems}/>
                <div className="cartInput">
                
                    
                    <span>{item.quantity}</span>
                </div>
                <p className="cartSubtotal">{`₹${item.price*item.quantity}`}</p>
            </div>
        ))}


            <div className="cartGrossProfit">
                <div></div>
                <div className="cartGrossProfitBox">
                    <p>Gross Total</p>
                    <p>{`₹${cartItems.reduce((acc,item)=>acc+item.quantity*item.price,0)}`}</p>
                </div>
                <div></div>
                <div className="checkOutBtn">
                    <button onClick={checkoutHandler}>Check Out</button>
                </div>
            </div>
        </div>
    </>)}
    </>
  )
}

export default Cart