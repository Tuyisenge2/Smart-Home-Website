import API from "@/utils/Api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserUpdateType {
    id: string;
    name?: string;
    role_id?: number;
    is_active?: boolean;
}

interface UserState {
    isLoading: boolean;
    data: any;
    error: string | null;
}

const initialState: UserState = {
    isLoading: false,
    data: null,
    error: null,
};

export const updateUserThunk = createAsyncThunk(
    'user/update',
    async ({ id, ...userData }: UserUpdateType, { rejectWithValue }) => {
        try {
            const { data } = await API.put(`/users/${id}`, userData);
            return data;
        } catch (error) {
            return rejectWithValue((error as any).response?.data);
        }
    },
);

const userUpdateSlice = createSlice({
    name: 'userUpdate',
    initialState,
    reducers: {
        resetUserUpdateState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUserThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                updateUserThunk.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.data = action.payload;
                    state.error = null;
                },
            )
            .addCase(
                updateUserThunk.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.error = action.payload?.message || 'Failed to update user';
                },
            );
    },
});

//export const { resetUserUpdateState } = userUpdateSlice.actions;
export default userUpdateSlice.reducer;