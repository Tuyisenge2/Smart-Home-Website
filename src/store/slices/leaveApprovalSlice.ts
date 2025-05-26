import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { number } from "zod";

interface LeaveApprovalState {
  isLoading: boolean;
  data: any;
  error: any;
}

interface LeaveApprovalDataTypes {
  id: number;
  status: string;

}

const initialState: LeaveApprovalState = {
  isLoading: false,
  data: [],
  error: null,
};

export const approveLeave = createAsyncThunk(
  "leaveApproval/approve",
  async (leaveData: LeaveApprovalDataTypes, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/leave-applications/${leaveData.id}`, {
        status: leaveData.status,
      });

      // Send email notification
  

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve leave"
      );
    }
  }
);

const leaveApprovalSlice = createSlice({
  name: "leaveApproval",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(approveLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveLeave.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.data = [...state.data, action.payload];
        state.error = null;
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default leaveApprovalSlice.reducer;
