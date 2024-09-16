import { User } from "../../interface";
import { createSlice } from "@reduxjs/toolkit";
import { saveLocal } from "./Local";
import {
  block,
  followUser,
  getAllUser,
  login,
  register,
  unblock,
  updateProfile, 
} from "@/service/user.service";

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
      .addCase(updateProfile.fulfilled, (state: any, action: any) => {
        const index = state.user.findIndex(
          (user: User) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.user[index] = action.payload;
        }
        state.loggedInUser = action.payload;
        saveLocal("loggedInUser", action.payload);
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { updatedCurrentUser, updatedTargetUser } = action.payload;

        // Update currentUser and targetUser in state
        const currentUserIndex = state.user.findIndex(
          (user: User) => user.id === updatedCurrentUser.id
        );
        const targetUserIndex = state.user.findIndex(
          (user: User) => user.id === updatedTargetUser.id
        );

        if (currentUserIndex !== -1) {
          state.user[currentUserIndex] = updatedCurrentUser;
        }

        if (targetUserIndex !== -1) {
          state.user[targetUserIndex] = updatedTargetUser;
        }
      })
      .addCase(block.fulfilled, (state: any, action: any) => {
        const index = state.user.findIndex(
          (user: User) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.user[index] = action.payload;
        }
      })
      .addCase(unblock.fulfilled, (state: any, action: any) => {
        const index = state.user.findIndex(
          (user: User) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.user[index] = action.payload;
        }
      })
  },
});

export default userReducer.reducer;
