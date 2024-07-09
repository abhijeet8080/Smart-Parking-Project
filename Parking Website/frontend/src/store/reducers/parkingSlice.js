import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  parkings: [],
  parkingCount: 0,
  loading: false,
  resultPerPage:0,
};

export const getAllParkings = createAsyncThunk(
  'parkings/getAllParkings',
  async ({ keyword = "", currentPage = 1, price = [0, 100000], category, ratings = 0 }, thunkAPI) => {
    const maxAttempts = 3; // Maximum number of retry attempts
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        let link = `http://localhost:4000/api/v1/parking?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`;
        if (category) {
          link = `http://localhost:4000/api/v1/parking?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}`;
        }
        const response = await axios.get(link);
        return response.data;
      } catch (error) {
        attempt++;
        if (attempt === maxAttempts) {
          return thunkAPI.rejectWithValue(error.response.data.message);
        } else {
          // Add a delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
      }
    }
  }
);


export const getParkingDetails = createAsyncThunk(
  'parkings/getParkingDetails',
  async (id, thunkAPI) => {
    const maxAttempts = 3; // Maximum number of retry attempts
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        const link = `http://localhost:4000/api/v1/parking/${id}`;
        const response = await axios.get(link);
        return response.data;
      } catch (error) {
        attempt++;
        if (attempt === maxAttempts) {
          return thunkAPI.rejectWithValue(error.response.data.message);
        } else {
          // Add a delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
      }
    }
  }
);


const parkingSlice = createSlice({
  name: 'parkings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllParkings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllParkings.fulfilled, (state, action) => {
        state.loading = false;
        state.parkings = action.payload.parkings;
        state.parkingCount = action.payload.parkingCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.error = null; // Clear any previous errors
      })
      .addCase(getAllParkings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Update state with error message
      })
      .addCase(getParkingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParkingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingDetails = action.payload.parking;
        state.error = null; // Clear any previous errors
      })
      .addCase(getParkingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Update state with error message
      });
  },
});


export default parkingSlice.reducer;
