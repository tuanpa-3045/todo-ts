import { createAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import { ITask } from '../../App';
import { API } from '../../constants';

interface IInitialState {
  todos: ITask[];
  filter: {
    _page: number;
    _limit: number;
    _totalRows: number;
    inputTodo_like: string;
  };
  isLoading: boolean;
}

interface IPayload {
  data: ITask;
  pagination: any;
}

const initialState: IInitialState = {
  todos: [],
  filter: {
    _page: 1,
    _limit: 3,
    _totalRows: 0,
    inputTodo_like: '',
  },
  isLoading: false,
};

export const fetchTodos = createAsyncThunk(
  'todos/getTodo',
  async (filter: any) => {
    try {
      const { data } = await axios.get(
        `https://todots-api.herokuapp.com/todos`,
        {
          params: filter,
        }
      );

      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (payload: ITask, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `https://todots-api.herokuapp.com/todos`,
        payload
      );
      dispatch(fetchTodos({ _page: 1, _limit: 3 }));
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async ({ id }: ITask, { dispatch }) => {
    try {
      const { data } = await axios.delete(
        `https://todots-api.herokuapp.com/todos/${id}`
      );
      dispatch(fetchTodos({ _page: 1, _limit: 3 }));
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const editTodo = createAsyncThunk(
  'todos/editTodo',
  async ({ id, ...rest }: ITask, { dispatch }) => {
    try {
      const { data } = await axios.patch(
        `https://todots-api.herokuapp.com/todos/${id}`,
        rest
      );
      dispatch(fetchTodos(initialState.filter));
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const searchTodo = createAsyncThunk(
  'todos/searchTodo',
  async ({ filter, inputTodo_like }: any, { dispatch }) => {
    try {
      const { data } = await axios.get(
        `https://todots-api.herokuapp.com/todos?inputTodo_like=${inputTodo_like}`,
        { params: filter }
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, { payload }: any) => {
        const { data, pagination } = payload;
        state.isLoading = false;
        state.todos = data;
        state.filter = pagination;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTodo.fulfilled, (state, payload) => {
        state.todos = [...state.todos, payload.payload];
        state.filter = {
          ...state.filter,
        };
      })
      .addCase(addTodo.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(removeTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeTodo.fulfilled, (state) => {
        state.isLoading = false;
        state.filter = {
          ...state.filter,
          _page: 1,
        };
      })
      .addCase(removeTodo.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchTodo.fulfilled, (state, { payload }) => {
        const { data, pagination } = payload;

        state.isLoading = false;
        state.todos = data;
        state.filter = {
          ...state.filter,
          _page: pagination._page,
          _totalRows: pagination._totalRows,
        };
      })
      .addCase(searchTodo.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default todoSlice.reducer;
