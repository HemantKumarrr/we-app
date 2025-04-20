import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: JSON.parse(localStorage.getItem("posts")) || [],
  comments: JSON.parse(localStorage.getItem("comments")) || [],
  savedPosts: JSON.parse(localStorage.getItem("savedPosts")) || [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    allPostsData: (state, action) => {
      state.posts = action.payload;
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((item) => item._id !== action.payload);
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },
    setAllComments: (state, action) => {
      state.comments = action.payload;
      localStorage.setItem("comments", JSON.stringify(state.comments));
    },
    setReply: (state, action) => {
      state.comments.push(action.payload);
      localStorage.setItem("comments", JSON.stringify(state.comments));
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("comments", JSON.stringify(state.comments));
    },
    setSavedPosts: (state, action) => {
      if (state.savedPosts.includes(action.payload)) {
        state.savedPosts = state.savedPosts.filter(
          (item) => item !== action.payload
        );
      } else {
        state.savedPosts.push(action.payload);
      }
      localStorage.setItem("savedPosts", JSON.stringify(state.savedPosts));
    },
  },
});

export const {
  allPostsData,
  addPost,
  deletePost,
  setAllComments,
  setReply,
  deleteComment,
  setSavedPosts,
} = postsSlice.actions;
export default postsSlice.reducer;
