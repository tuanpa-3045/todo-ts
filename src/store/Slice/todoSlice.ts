import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  getTodoServer,
  createTodoServer,
  editTodoServer,
  deleteTodoServer,
} from '../../Service';

import axios from 'axios';
import { ITask } from '../../App';
import { API } from '../../constants';

const initialState = {
  todos: [] as ITask[],
  filter: {
    _page: 1,
    _limit: 3,
    q: '',
  },
  isLoading: false,
};

export const fetchTodos = createAsyncThunk(
  'todos/getTodo',
  async (filter: string) => {
    try {
      const { data } = await axios.get(`${API}`);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);


const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // addTodo(state, action) {
    //   state.todos.push(action.payload);
    // },
    // editTodo(state, { payload }) {},
    // removeTodo(state, { payload }) {
    //   state.todos.filter((item) => item.id !== payload.id);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.isLoading = false;
      });
    // builder.addCase(createAction('editTodo'), (state, action) => {
    //   return state;
    // });
    // builder.addCase(createAction('removeTodo'), (state, action) => {
    //   return state;
    // });
  },
});

// export const { addTodo, editTodo, removeTodo } = todoSlice.actions;

export default todoSlice.reducer;
