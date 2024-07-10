import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import { SIGN_OUT } from "../auth/constants";

const initialState = {
  uid: "",
  suid: "",
};

function signOutReducer(state, action) {
  switch (action.type) {
    case SIGN_OUT: {
      return initialState;
    }
    default:
      return state;
  }
}

const reducers = {
  setUser(state, { payload }) {
    Object.assign(state, payload);
    //        Object.assign(state, pick(payload, Object.keys(initialState)));
  },
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: reducers,
  extraReducers: (builder) => {
    builder.addCase(SIGN_OUT, signOutReducer);
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
