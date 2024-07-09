import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { format, isBefore } from 'date-fns';

const initialState = {
  cartItems: localStorage.getItem("cartItems")?JSON.parse(localStorage.getItem("cartItems")):[],
  bookingInfo:localStorage.getItem("bookingInfo")?JSON.parse(localStorage.getItem("bookingInfo")): {},
  loading: false,
  error: null
};

export const addItemsToCart = createAsyncThunk(
    "cart/addItemsToCart",
    async ({ id, selectedParkingSpaces }, { getState }) => {
      try {
        console.log(selectedParkingSpaces)
        const { data } = await axios.get(`http://localhost:4000/api/v1/parking/${id}`);
        return {
          parking: data.parking._id, 
          name: data.parking.name,
          price: data.parking.price,
          image: data.parking.images[0].url, 
          noOfParkingSpaces: data.parking.noOfParkingSpaces, 
          quantity:selectedParkingSpaces.length,
          selectedParkingSpaces
        };
      } catch (error) {
        console.error("Error adding items to cart:", error);
        throw error;
      }
    }
  );
  
  export const saveBookingInfo = createAsyncThunk(
    "cart/saveBookingInfo",
    async ({ datestr, timestr, phoneNo, licence }, { rejectWithValue }) => {
      try {
        let bookingData = { datestr, timestr, phoneNo, licence };
        if (!datestr || !timestr) {
          const currentDate = new Date();
          const formattedDate = !datestr ? format(currentDate, 'yyyy-MM-dd') : datestr;
          const formattedTime = !timestr ? format(currentDate, 'hh:mm a') : timestr;
          bookingData = { datestr: formattedDate, timestr: formattedTime, phoneNo, licence };
        }
        
        localStorage.setItem("bookingInfo", JSON.stringify(bookingData));
        return bookingData;
      } catch (error) {
        console.error("Error saving booking info:", error);
        return rejectWithValue(error.message);
      }
    }
  );
  
  
  
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeItemFromCart(state, action) {
      state.cartItems = state.cartItems.filter((i) => i.parking !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Update local storage
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const newItem = action.payload;
        const existingItemIndex = state.cartItems.findIndex((item) => item.parking === newItem.parking);
      
        if (existingItemIndex !== -1) {
          // If the item already exists in the cart, update the quantity
          state.cartItems[existingItemIndex].quantity = newItem.quantity;
        } else {
          // If the item doesn't exist, add it to the cart
          state.cartItems.push(newItem);
        }
      
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Save cartItems to localStorage
      })
      
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveBookingInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBookingInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.bookingInfo = action.payload
      })
      .addCase(saveBookingInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;
