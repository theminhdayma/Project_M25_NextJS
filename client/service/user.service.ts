import { User } from "@/interface";
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

    const EncryptedPassword = CryptoJS.AES.encrypt(
      password,
      "secret_key"
    ).toString();

    const newUser = {
      id: Date.now(),
      name: username,
      password: EncryptedPassword,
      email,
      avatar: "",
      banner: "",
      biography: [],
      gender: "chưa có",
      postsById: [],
      followersById: [],
      status: true,
      private: false,
      requestFollowById: [],
      listFrend: [],
      role: 1,
    };
    const response = await axios.post("http://localhost:8080/users", newUser);
    return response.data;
  }
);

export const login = createAsyncThunk("user/login", async (id: number) => {
  const response = await axios.get(`http://localhost:8080/users/${id}`);
  return response.data;
});

export const logout = createAsyncThunk(
  "user/logoutUser",
  async (id: number) => {
    const response = await axios.patch(`http://localhost:8080/users/${id}`);
    return response.data;
  }
);

export const followUser: any = createAsyncThunk(
  "user/followUser",
  async (data: { userId: number; targetUserId: number }) => {
    const { userId, targetUserId } = data;

    // Fetch current user and target user details
    const currentUserResponse = await axios.get(
      `http://localhost:8080/users/${userId}`
    );
    const targetUserResponse = await axios.get(
      `http://localhost:8080/users/${targetUserId}`
    );

    const currentUser = currentUserResponse.data;
    const targetUser = targetUserResponse.data;

    // Update targetUser (add currentUser to followersById)
    const updatedTargetUser = {
      ...targetUser,
      followersById: [...targetUser.followersById, userId],
    };
    await axios.patch(
      `http://localhost:8080/users/${targetUserId}`,
      updatedTargetUser
    );

    // Update currentUser (add targetUser to requestFollowById)
    const updatedCurrentUser = {
      ...currentUser,
      requestFollowById: [...currentUser.requestFollowById, targetUserId],
    };
    await axios.patch(
      `http://localhost:8080/users/${userId}`,
      updatedCurrentUser
    );

    return {
      updatedCurrentUser,
      updatedTargetUser,
    };
  }
);

export const unfollowUserAction = createAsyncThunk(
  "user/unfollowUser",
  async (data: { targetUserId: number; userId: number }) => {
    // Gọi API "unfollow"
    await axios.post("http://localhost:8080/unfollow", data);

    // Trả về ID của người bị bỏ theo dõi để dùng trong reducer
    return data.targetUserId;
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateUser",
  async (user: User) => {
    const response = await axios.patch(
      `http://localhost:8080/users/${user.id}`,
      user
    );
    return response.data;
  }
);

export const block: any = createAsyncThunk(
  "user/blockUser",
  async (id: number) => {
    const response = await axios.patch(`http://localhost:8080/users/${id}`, {
      status: false,
    });
    return response.data;
  }
);

export const unblock: any = createAsyncThunk(
  "user/unblockUser",
  async (id: number) => {
    const response = await axios.patch(`http://localhost:8080/users/${id}`, {
      status: true,
    });
    return response.data;
  }
);

// Thêm thunk mới để tìm kiếm người dùng theo tên
export const searchUserByName: any = createAsyncThunk(
  "user/searchUserByName",
  async (name: string) => {
    const response = await axios.get(
      `http://localhost:8080/users?name_like=${name}&_sort=id&_order=desc`
    );
    return response.data;
  }
);