import { createSelector } from "@reduxjs/toolkit";

export const getUser = (state) => state.user;

export const getUserSuid = createSelector(getUser, (el) => el.suid);
