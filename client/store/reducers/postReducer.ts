import { Post } from "@/interface";
import {
  getAllPost,
  createPost,
  blockPost,
  updatePost,
  deletePost,
  unblockPost,
  updatePostLikes,
} from "@/service/post.service";
import { createSlice } from "@reduxjs/toolkit";

const listPost: Post[] = [];

const postReducer = createSlice({
  name: "post",
  initialState: {
    post: listPost,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPost.fulfilled, (state: any, action: any) => {
      state.post = action.payload;
    });
    builder
      .addCase(createPost.fulfilled, (state: any, action: any) => {
        state.post.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state: any, action: any) => {
        const updatedPost = action.payload;
        const index = state.post.findIndex((post:Post) => post.id === updatedPost.id);
        if (index !== -1) {
          state.post[index] = updatedPost;
        }
      })
      .addCase(deletePost.fulfilled, (state: any, action: any) => {
        state.post = state.post.filter((post: Post) => post.id !== action.payload);
      })
      .addCase(blockPost.fulfilled, (state: any, action: any) => {
        const index = state.post.findIndex(
          (post: Post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.post[index] = action.payload;
        }
      })
      .addCase(unblockPost.fulfilled, (state: any, action: any) => {
        const index = state.post.findIndex(
          (post: Post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.post[index] = action.payload;
        }
      })
      .addCase(updatePostLikes.fulfilled, (state: any, action: any) => {
        const updatedPost = action.payload;
        const index = state.post.findIndex((post: Post) => post.id === updatedPost.id);
        if (index !== -1) {
          state.post[index] = updatedPost;
        }
      })
  },
});

export default postReducer.reducer;
