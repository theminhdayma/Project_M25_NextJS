import { Post } from "@/interface";
import { getAllPost } from "@/service/post.service";
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
  },
});

export default postReducer.reducer;