import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";


export const getAllUser: any = createAsyncThunk(
    "user/getAllAccount",
    async () => {
      const res = await axios.get("http://localhost:8080/users");
      return res.data;
    }
  );

  export const register: any = createAsyncThunk(
    "user/registerUser",
    async (formData: { username: string; email: string; password: string }) => {
      const { username, email, password } = formData;
      
      // Mã hóa mật khẩu
      const EncryptedPassword = CryptoJS.AES.encrypt(password, "secret_key").toString();
  
      const newUser = {
        id: Date.now(),
        name: username,
        password: EncryptedPassword,
        email,
        avatar: "",
        biography: "chưa có",
        gender: "chưa có",
        postsById: [],
        followersById: [],
        status: true,
        private: false,
        requestFollowById: [],
        role: 1
      };
      const response = await axios.post("http://localhost:8080/users", newUser);
      return response.data;
    }
  );
  
  
  export const login = createAsyncThunk(
    "user/login",
    async (id: number) => {
      const response = await axios.get(`http://localhost:8080/users/${id}`,);
      return response.data;
    }
  );
  
  
  export const logout = createAsyncThunk(
    "user/logoutUser",
    async (id: number) => {
      const response = await axios.patch(`http://localhost:8080/users/${id}`);
      return response.data;
    }
  );
