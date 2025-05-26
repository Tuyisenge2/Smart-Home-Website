import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface GoogleState {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

}

const initialState: GoogleState = {
  token: '',
  isAuthenticated: false,
  loading: false,
  error: null,
};

const googleSlice = createSlice({
  name: "google",
  initialState,
  reducers: {
    googleSignInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    googleSignInSuccess: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    googleSignInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    googleSignOut: (state) => {
      state.token ='';
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  googleSignInStart,
  googleSignInSuccess,
  googleSignInFailure,
  googleSignOut,
} = googleSlice.actions;

export default googleSlice.reducer;
