import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LeaveTypeState {
    isLoading: boolean;
	data: any;
	error: any ;
}

const initialState: LeaveTypeState = {
  isLoading: false,
  data: [],
  error: null,
};


export const fetchLeavesType = createAsyncThunk(
	'fetchLeavesType',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await API.get('/leave-types');
			return data;
		} catch (error:any) {
      console.error("API Error:", error); // Log full error

      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch leaves",
        status: error.response?.status,
      });		}
	},
);



const fetchLeavesTypeSlice = createSlice(  
  {
    name: 'fetchLeavesType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchLeavesType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  
      builder.addCase(
        fetchLeavesType.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = [...state.data, action.payload];
          state.error = null;
        },
    );
  
      builder.addCase(
        fetchLeavesType.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.data;
        },
      );
    },
  }
      
    

);


export default fetchLeavesTypeSlice.reducer;
