import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import commonReducer from "./commonSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
  },
});

export default store;

