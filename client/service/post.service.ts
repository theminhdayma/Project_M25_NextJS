import { Post } from "@/interface";
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

// Cập nhật bài viết
export const updatePost: any = createAsyncThunk(
  "post/updatePost",
  async (updatedPost: Post) => {
    const res = await axios.put(
      `http://localhost:8080/posts/${updatedPost.id}`,
      updatedPost
    );
    return res.data;
  }
);

// Xóa bài viết
export const deletePost = createAsyncThunk<number, number>(
  "post/deletePost",
  async (id: number) => {
    await axios.delete(`http://localhost:8080/posts/${id}`);
    return id;
  }
);

// Ẩn bài viết
export const blockPost: any = createAsyncThunk(
  "post/blockPost",
  async (id: number) => {
    const response = await axios.patch(`http://localhost:8080/posts/${id}`, {
      status: false, // Set status to false to block the post
    });
    return response.data;
  }
);

// Hiện bài viết
export const unblockPost: any = createAsyncThunk(
  "post/unblockPost",
  async (id: number) => {
    const response = await axios.patch(`http://localhost:8080/posts/${id}`, {
      status: true, // Set status to true to unblock the post
    });
    return response.data;
  }
);