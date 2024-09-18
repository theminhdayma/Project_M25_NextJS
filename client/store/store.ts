import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import postReducer from "./reducers/postReducer";
import commentReducer from "./reducers/commentReducer";
const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    comment: commentReducer
  },
});

export default store;
