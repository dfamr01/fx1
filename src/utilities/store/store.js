import { configureStore } from "@reduxjs/toolkit";
import { isDevelopmentEnv } from "../utils.js";
import reducer from "./reducers.js";
import middlewares from "./middlewares.js";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: reducer,
  devTools: isDevelopmentEnv,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //     // Ignore these action types
      //     // ignoredActions: ['your/action/type'],
      //     // Ignore these field paths in all actions
      //     ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta', 'meta.timestamp', 'meta.updatedAt', 'meta.arg.updatedAt', 'payload.updatedAt'],
      //     // Ignore these paths in the state
      //     ignoredPaths: ['user.updatedAt'],
      // },
    }).concat(middlewares),
});

setupListeners(store.dispatch);

export const dispatch = store.dispatch;

export function getStoreDispatch() {
  return store.dispatch;
}

export function getStoreState() {
  return store.getState();
}

export function getStore() {
  return store;
}

export default store;
