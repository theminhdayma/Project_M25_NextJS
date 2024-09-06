import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import postReducer from "./reducers/postReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer
  },
});

export default store;
