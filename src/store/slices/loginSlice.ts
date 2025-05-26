import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface loginType{
    email:string,
    password:string,
}

const initialState: any = {
	isLoading: false,
	data: [],
	error: null,
};

export const loginThunk = createAsyncThunk(
	'login',
	async ({ email,password }: loginType, { rejectWithValue }) => {
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
		builder.addCase(loginThunk.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(
			loginThunk.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.data = [...state.data, action.payload];
				state.error = null;
			},
		);
		builder.addCase(
			loginThunk.rejected,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.error = action.payload?.data?.message;
			},
		);
	},
});

export default loginSlice.reducer;
