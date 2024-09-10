import { User } from "../../interface";
import { createSlice } from "@reduxjs/toolkit";
import { saveLocal } from "./Local";
import {
  acceptFrend,
  friendRequest,
  getAllUser,
  login,
  register,
  updateProfile // Import action updateProfile
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
      .addCase(friendRequest.fulfilled, (state: any, action: any) => {
        const { userId, friendId } = action.payload;
        const userIndex = state.user.findIndex(
          (user: User) => user.id === userId
        );
        const friendIndex = state.user.findIndex(
          (user: User) => user.id === friendId
        );
        if (userIndex !== -1 && friendIndex !== -1) {
          state.user[userIndex].requestFollowById.push(friendId);
          state.user[friendIndex].listFrend.push(userId);
        }
      })
      .addCase(acceptFrend.fulfilled, (state: any, action: any) => {
        const { userId, friendId } = action.payload;
        const userIndex = state.user.findIndex(
          (user: User) => user.id === userId
        );
        const friendIndex = state.user.findIndex(
          (user: User) => user.id === friendId
        );
        if (userIndex !== -1 && friendIndex !== -1) {
          state.user[userIndex].listFrend.push(friendId);
          state.user[friendIndex].listFrend.push(userId);
          state.user[userIndex].requestFollowById = state.user[
            userIndex
          ].requestFollowById.filter((id: number) => id !== friendId);
          state.user[friendIndex].requestFollowById = state.user[
            friendIndex
          ].requestFollowById.filter((id: number) => id !== userId);
        }
      })
      // .addCase(unFriend.fulfilled, (state: any, action: any) => {
      //   const { userId, friendId } = action.payload;
      //   const userIndex = state.user.findIndex(
      //     (user: User) => user.id === userId
      //   );
      //   const friendIndex = state.user.findIndex(
      //     (user: User) => user.id === friendId
      //   );
      //   if (userIndex !== -1 && friendIndex !== -1) {
      //     state.user[userIndex].listFrend = state.user[userIndex].listFrend.filter(
      //       (id: number) => id !== friendId
      //     );
      //     state.user[friendIndex].listFrend = state.user[friendIndex].listFrend.filter(
      //       (id: number) => id !== userId
      //     );
      //   }
      // });
  },
});

export default userReducer.reducer;
