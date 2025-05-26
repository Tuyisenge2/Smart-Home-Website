import API from "@/utils/Api";
import ApiVer2 from "@/utils/Api2";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface fetchUsersState {
    isLoading: boolean;
	data: any;
	error: any ;
}

const initialState: fetchUsersState = {
  isLoading: false,
  data: [],
  error: null,
};

export const fetchUsers = createAsyncThunk(
	'fetchUsers',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await ApiVer2.get('/employees');
			return data;
		} catch (error:any) {
      console.error("API Error:", error); // Log full error
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch leaves",
        status: error.response?.status,
      });		}
	},
);



const fetchUsersSlice = createSlice(  
  {
    name: 'fetchUsers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  
      builder.addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = [...state.data, action.payload];
          state.error = null;
        },
    );
  
      builder.addCase(
        fetchUsers.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.data;
        },
      );
    },
  }
      
    

);


export default fetchUsersSlice.reducer;
