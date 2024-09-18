// comment.service.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getComments = async (postId: number) => {
  const response = await axios.get(`${API_URL}/posts/${postId}`);
  return response.data;
};

export const addComment = async (postId: number, text: string) => {
  const response = await axios.post(`${API_URL}/posts/${postId}`, { text });
  return response.data;
};
