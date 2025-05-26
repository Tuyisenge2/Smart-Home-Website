import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LeaveHistoryState {
    isLoading: boolean;
	 data: any;
   	error: any ;
}

const initialState: LeaveHistoryState = {
  isLoading: false,
  data: [],
  error: null,
};


export const fetchLeavesHistory = createAsyncThunk(
	'fetchLeaveHistory',
	async (email: string, { rejectWithValue }) => {
		try {
    
      			const { data } = await API.get(`/leave-applications/employee/${email}`);
			return data;
		} catch (error:any) {
      console.error("API Error:", error); // Log full error

      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch leaves",
        status: error.response?.status,
      });		}
	},
);



const leaveHistorySlice = createSlice(  
  {
    name: 'fetchLeaveHistory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchLeavesHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  
      builder.addCase(
        fetchLeavesHistory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = [...state.data, action.payload];
          state.error = null;
        },
    );
  
      builder.addCase(
        fetchLeavesHistory.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.data;
        },
      );
    },
  }
      
    

);


export default leaveHistorySlice.reducer;
