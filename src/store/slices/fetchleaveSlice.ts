import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LeaveState {
    isLoading: boolean;
	data: any;
	error: any ;
}

const initialState: LeaveState = {
  isLoading: false,
  data: [],
  error: null,
};


export const fetchLeaves = createAsyncThunk(
	'fetchLeave',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await API.get('/leave-applications');
			return data;
		} catch (error:any) {
      console.error("API Error:", error); // Log full error

      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch leaves",
        status: error.response?.status,
      });		}
	},
);



const leaveSlice = createSlice(  
  {
    name: 'fetchLeaves',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchLeaves.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  
      builder.addCase(
        fetchLeaves.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = [...state.data, action.payload];
          state.error = null;
        },
    );
  
      builder.addCase(
        fetchLeaves.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.data;
        },
      );
    },
  }
      
    

);

// export const {
//   createSlice
// } = leaveSlice.actions;

export default leaveSlice.reducer;
