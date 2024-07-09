import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isUpdated: false, // Add isUpdated property to initial state
    message:"",
    success: false
};

export const resetIsUpdated = () => (dispatch) => {
  dispatch(userSlice.actions.resetIsUpdated());
};
export const resetSuccess = () => (dispatch) => {
  dispatch(userSlice.actions.resetSuccess());
};
// Login thunk action
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkAPI) => {
      try {
        
        const response = await axios.post(
          'http://localhost:4000/api/v1/login',
          { email, password },
          { headers: { 'Content-Type': 'application/json' } }
        );
        localStorage.setItem('token', response.data.token);
        
        return response.data.user;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
);

// Register thunk action
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
      try {

        const response = await axios.post(
          'http://localhost:4000/api/v1/register',
          userData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data.user;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
);

// Load User thunk action
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      };

      const response = await axios.get(`http://localhost:4000/api/v1/me`, config);
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// LogOut thunk action
export const logOut = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem('token');
      await axios.get('http://localhost:4000/api/v1/logout');
      return; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Update Profile thunk action
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:4000/api/v1/me/update",
        userData,
        config
      );
      return response.data.success;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

//Update Password
export const updatePassword = createAsyncThunk('auth/updatePassword',async(passwords,thunkAPI)=>{
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      },
    };
    const response = await axios.put(
      "http://localhost:4000/api/v1/password/update",
      passwords,
      config
    );
    
    return response.data.success;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})
//Forgot Password
export const forgotPassword = createAsyncThunk('auth/forgotPassword',async(email,thunkAPI)=>{
  try {
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    };

    const response = await axios.post(
      `http://localhost:4000/api/v1/password/forgot`,
      { email  },
      config
    );
    return response.data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})


//Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, thunkAPI) => {
      try {
         
          const config = {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          };

          const response = await axios.put(
              `http://localhost:4000/api/v1/password/reset/${token}`, // Corrected URL interpolation
              { password },
              config
          );
    
          return response.data.success;
      } catch (error) {
          return thunkAPI.rejectWithValue(error.response.data.message);
      }
  }
);


// Create slice
const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetIsUpdated: (state) => {
      state.isUpdated = false;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register reducers
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Load User reducers
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      // LogOut reducers
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = true; // Assuming user is authenticated during logout process
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Update Profile reducers
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUpdated = false; // Initialize isUpdated to false when profile update starts
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload; // Update isUpdated with the payload
      })
      //Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload; // Update isUpdated with the payload
      })
      //Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload; // Update isUpdated with the payload
      })
    //Reset Password
    .addCase(resetPassword.pending,(state)=>{
      state.loading = false;
      state.error = null;
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload; // Update isUpdated with the payload
    })
  },
});

// Export actions and reducer
export const authActions = {
  login,
  register,
  loadUser,
  logOut,
  updateProfile,
};

export default userSlice.reducer;
