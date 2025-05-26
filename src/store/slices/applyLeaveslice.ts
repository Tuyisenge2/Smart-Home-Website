import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface leaveType {
    email:string,
    reason:string,
    start_date:string,
    end_date:string,
    document_url:string,
    leaveTypeId:string,
}

const initialState: any = {
	isLoading: false,
	data: [],
	error: null,
};

export const applyleave = createAsyncThunk(
	'applyleave',
	async ({ email,reason,document_url,end_date,start_date,leaveTypeId }: leaveType, { rejectWithValue }) => {
		try {
			const { data } = await API.post('/leave-applications', {
				email,reason,document_url,end_date,start_date,leaveTypeId
			});
			return data;
		} catch (error) {
			return rejectWithValue((error as any).response);
		}
	},
);

const applyleaveSlice = createSlice({
	name: 'createWish',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(applyleave.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(
			applyleave.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.data = [...state.data, action.payload];
				state.error = null;
			},
		);
		builder.addCase(
			applyleave.rejected,
			(state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.error = action.payload?.data?.message;
			},
		);
	},
});

export default applyleaveSlice.reducer;
