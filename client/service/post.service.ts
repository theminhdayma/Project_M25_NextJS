import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Lấy tất cả bài viết
export const getAllPost: any = createAsyncThunk(
  "post/getListPost",
  async () => {
    const res = await axios.get("http://localhost:8080/posts");
    return res.data;
  }
);

// Thêm mới bài viết
export const createPost: any = createAsyncThunk(
  "post/createPost",
  async (newPost: any) => {
    const res = await axios.post("http://localhost:8080/posts", newPost);
    return res.data;
  }
);
