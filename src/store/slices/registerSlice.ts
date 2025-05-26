import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface registerType{
    email:string,
    password:string,
    name:string,
}

const initialState: any = {
	isLoading: false,
	data: [],
	error: null,
};

export const registerThunk = createAsyncThunk(
	'register',
	async ({ email,password ,name}: registerType, { rejectWithValue }) => {
		try {
			const { data } = await API.post('/auth/register', {
				email,password,name
			});
			return data;
		} catch (error) {
			return rejectWithValue((error as any).response);
		}
	},
);

const registerSlice = createSlice({
	name: 'register',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(registerThunk.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(
			registerThunk.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.data = [...state.data, action.payload];
				state.error = null;
			},
		);
		builder.addCase(
			registerThunk.rejected,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.error = action.payload?.data?.message;
			},
		);
	},
});

export default registerSlice.reducer;
