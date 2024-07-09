import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (booking , thunkAPI) => {
        try {
            console.log("create Booking is called")
            console.log(booking)
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            

            if (!token) {
            throw new Error("Token not found in localStorage");
            }
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`, // Include token in the Authorization header
                },
              };
              const response = await axios.post(
                `http://localhost:4000/api/v1/booking/new`,
                booking,
                config
              );
              console.log(response.data)
            
            return response.data;
        } catch (error) {
            
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);
export const myOrders = createAsyncThunk(
    'booking/myOrders',
    async (_, thunkAPI) => {
        try {
            console.log("My order function si ")
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token not found in localStorage");
            }
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(
                `http://localhost:4000/api/v1/bookings/me`,
                config
            );
            return response.data.myBookings;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

//Get Order Details
export const getOrderDetails = createAsyncThunk(
    'booking/getOrderDetails',
    async (id, thunkAPI) => {
        try {
            console.log("My order function si ")
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token not found in localStorage");
            }
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(
                `http://localhost:4000/api/v1/booking/${id}`,
                config
            );
            console.log(response.data.booking)
            return response.data.booking;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);


const initialState = {
    booking: null, 
    loading: false, 
    error: null, 
    bookings:[],
    bookingDetails:{}
};


const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload;
                state.error = null;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(myOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(myOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
                state.error = null;
            })
            .addCase(myOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingDetails = action.payload;
                state.error = null;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const {} = bookingSlice.actions;
export default bookingSlice.reducer;
