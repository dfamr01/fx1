import { createSlice } from "@reduxjs/toolkit";
import { SIGN_OUT } from "./constants";

const initialState = {
  isLoggedIn: !!localStorage.getItem("isLoggedIn"),
};

function signOutReducer(state, action) {
  switch (action.type) {
    case SIGN_OUT: {
      return { isLoggedIn: false };
    }
    default:
      return state;
  }
}

const reducers = {
  setAuth(state, { payload }) {
    Object.assign(state, payload);
  },
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: reducers,
  extraReducers: (builder) => {
    builder.addCase(SIGN_OUT, signOutReducer);
  },
});

export const { setAuth } = auth.actions;
export default auth.reducer;
