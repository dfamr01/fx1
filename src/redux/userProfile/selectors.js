import { createSelector } from "@reduxjs/toolkit";

export const getUserProfile = (state) => state.userProfile;

export const getUserProfileSuid = createSelector(
  getUserProfile,
  (el) => el.suid,
);
