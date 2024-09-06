import { User } from "../../interface";
import { createSlice } from "@reduxjs/toolkit";
import { saveLocal } from "./Local";
import { getAllUser, login, register } from "@/service/user.service";

const listAccount: User[] = [];

const userReducer = createSlice({
  name: "user",
  initialState: {
    user: listAccount,
    loggedInUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.fulfilled, (state: any, action: any) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state: any, action: any) => {
        state.user.push(action.payload);
      })
      .addCase(login.fulfilled, (state: any, action: any) => {
        const index = state.user.findIndex(
          (user: User) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.user[index] = action.payload;
        }
        state.loggedInUser = action.payload;
        console.log(action.payload);
        
        saveLocal("loggedInUser", action.payload);
      })
  },
});

export default userReducer.reducer;