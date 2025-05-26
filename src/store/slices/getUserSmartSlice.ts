import API from "@/utils/Api";
import ApiVer2 from "@/utils/Api2";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface fetchUserSmartState {
    isLoading: boolean;
	data: any;
	error: any ;
}

const initialState: fetchUserSmartState = {
  isLoading: false,
  data: [],
  error: null,
};

export const fetchUsersSmart = createAsyncThunk(
	'fetchUsers',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await ApiVer2.get('/users');
			return data;
		} catch (error:any) {
      console.error("API Error:", error); // Log full error
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch leaves",
        status: error.response?.status,
      });		}
	},
);



const fetchUserSmartSlice = createSlice(  
  {
    name: 'fetchUsers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchUsersSmart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  
      builder.addCase(
        fetchUsersSmart.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = [...state.data, action.payload];
          state.error = null;
        },
    );
  
      builder.addCase(
        fetchUsersSmart.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.data;
        },
      );
    },
  }
      
    

);


export default fetchUserSmartSlice.reducer;
