import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import { SIGN_OUT } from "../auth/constants";

const initialState = {
  uid: "",
  suid: "",
  isAgent: false,
  email: "",
  displayName: "",
  phoneNumber: "",
  avatar: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  status: "",
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
  setUserProfile(state, { payload }) {
    Object.assign(state, payload);
  },
  updateUserProfile(state, { payload }) {
    Object.assign(state, payload);
  },
};

const slice = createSlice({
  name: "userProfile",
  initialState,
  reducers: reducers,
  extraReducers: (builder) => {
    builder.addCase(SIGN_OUT, signOutReducer);
  },
});

export const { setUserProfile, updateUserProfile } = slice.actions;
export default slice.reducer;
