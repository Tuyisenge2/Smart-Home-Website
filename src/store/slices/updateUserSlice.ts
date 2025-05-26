import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userType{
    email:string,
    password:string,
}

const initialState: any = {
	isLoading: false,
	data: [],
	error: null,
};

export const updateUserThunk = createAsyncThunk(
	'login',
	async ({ email,password }: userType, { rejectWithValue }) => {
		try {
			const { data } = await API.post('/auth/login', {
				email,password
			});
			return data;
		} catch (error) {
			return rejectWithValue((error as any).response);
		}
	},
);

const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(updateUserThunk.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(
			updateUserThunk.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.data = [...state.data, action.payload];
				state.error = null;
			},
		);
		builder.addCase(
			updateUserThunk.rejected,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.error = action.payload?.data?.message;
			},
		);
	},
});

export default loginSlice.reducer;
