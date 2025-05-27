import API from "@/utils/Api";
import ApiVer2 from "@/utils/Api2";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
  id: number;
  name: string;
}

interface RoleState {
  isLoading: boolean;
  data: Array<{ data: Role[] }>;
  error: any;
}

const initialState: RoleState = {
  isLoading: false,
  data: [],
  error: null,
};

export const fetchingRoleThunk = createAsyncThunk(
  "role/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await ApiVer2.get("/roles");
      return data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch roles",
        status: error.response?.status,
      });
    }
  }
);

export const creatingRoleThunk = createAsyncThunk(
  "role/createRole",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/roles", { name });
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to create role",
        status: error.response?.status,
      });
    }
  }
);


export const deletingRoleThunk = createAsyncThunk(
  "role/deleteRole",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/roles/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete role",
        status: error.response?.status,
      });
    }
  }
);


export const updatingRoleThunk = createAsyncThunk(
    "role/updateRole",
    async ({  id,name }: {id:number, name: string }, { rejectWithValue }) => {
      try {
        const { data } = await API.put( `/roles/${id}`, {name});
        return data;
      } catch (error: any) {
        return rejectWithValue({
          message: error.response?.data?.message || "Failed to create role",
          status: error.response?.status,
        });
      }
    }
  );



const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch roles
    builder
      .addCase(fetchingRoleThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchingRoleThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = [...state.data, action.payload];
          state.error = null;
        }
      )
      .addCase(
        fetchingRoleThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.message || "Failed to fetch roles";
        }
      );

    // Create role
    builder
      .addCase(creatingRoleThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        creatingRoleThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          if (state.data.length > 0) {
            const lastData = state.data[state.data.length - 1];
            lastData.data = [...lastData.data, action.payload];
          }
          state.error = null;
        }
      )
      .addCase(
        creatingRoleThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.message || "Failed to create role";
        }
      );

    builder
      .addCase(deletingRoleThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deletingRoleThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          if (state.data.length > 0) {
            const lastData = state.data[state.data.length - 1];
            lastData.data = [...lastData.data, action.payload];
          }
          state.error = null;
        }
      )
      .addCase(
        deletingRoleThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.message || "Failed to delete role";
        }
      );

      builder
      .addCase(updatingRoleThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updatingRoleThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          if (state.data.length > 0) {
            const lastData = state.data[state.data.length - 1];
            lastData.data = [...lastData.data, action.payload];
          }
          state.error = null;
        }
      )
      .addCase(
        updatingRoleThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload?.message || "Failed to updare role";
        }
      );
  },
});

export default roleSlice.reducer;
