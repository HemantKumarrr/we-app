import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth.slice";
import postsReducer from "../features/post.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});
