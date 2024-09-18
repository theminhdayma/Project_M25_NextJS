// commentReducer.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '@/interface';
import { getComments as fetchComments, addComment as postComment } from '@/service/comment.service';

interface CommentState {
  comments: Comment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  status: 'idle',
  error: null,
};

// Async thunks for fetching and adding comments
export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchCommentsByPostId',
  async (postId: number) => {
    const response = await fetchComments(postId);
    return response;
  }
);

export const addCommentToPost = createAsyncThunk(
  'comments/addCommentToPost',
  async ({ postId, text }: { postId: number; text: string }) => {
    const response = await postComment(postId, text);
    return response;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(addCommentToPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCommentToPost.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.status = 'succeeded';
        state.comments.push(action.payload);
      })
      .addCase(addCommentToPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add comment';
      });
  },
});

export default commentSlice.reducer;
