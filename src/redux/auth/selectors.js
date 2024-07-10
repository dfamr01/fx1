import { createSelector } from "@reduxjs/toolkit";

export const getAuth = (state) => state.auth;

export const getAuthIsLoggedIn = createSelector(
  getAuth,
  (auth) => auth.isLoggedIn,
);
