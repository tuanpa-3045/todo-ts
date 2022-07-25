import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';

import todoReducer from './Slice/todoSlice';

export const store = configureStore({
  reducer: {
    todoReducer,
  },
  middleware: [thunkMiddleware]
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
