import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllPost: any = createAsyncThunk(
    "post/getListPost",
    async () => {
      const res = await axios.get("http://localhost:8080/posts");
      return res.data;
    }
  );