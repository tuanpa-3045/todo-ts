import React, { useEffect, useState, ReactNode } from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Grid, Button, Input, Pagination } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';

import { fetchTodos } from './store/Slice/todoSlice';

import { v4 as uuidv4 } from 'uuid';
import Task from './components/Task';

import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';

export interface ITask {
  inputTodo: string;
  id: string;
  status: boolean;
  createAt?: Date;
}

export const App = () => {
  const [todo, setTodo] = useState<ITask[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { filter } = useSelector((state: RootState) => state.todoReducer);
  useEffect(() => {
    // dispatch(fetchTodos(filter));
  }, []);

  const removeTodo = (id: string): any => {
    const arr = todo.filter((item: ITask) => item.id != id);
    setTodo(arr);
  };

  const editTodo = ({ id, value, callback }: any) => {
    const index = todo.findIndex((item: ITask) => item.id === id);
    todo[index].inputTodo = value;
    setTodo(todo);
    callback();
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    resetField,
  } = useForm();

  useEffect(() => {}, []);

  const onSubmit = (data: any): void => {
    setTodo([
      ...todo,
      {
        id: uuidv4(),
        inputTodo: data.inputTodo,
        status: false,
      },
    ]);

    resetField('inputTodo');
  };

  const handleChecked = (id: string) => {
    const index = todo.findIndex((ele: ITask) => ele.id === id);
    todo[index].status = !todo[index].status;
    setTodo([...todo]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = todo.filter((item) =>
      item.inputTodo.includes(e.target.value)
    );
  };

  const filterTaskList = todo.filter(
    (item) =>
      item.inputTodo.toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
  );

  const renderTaskList = () =>
    filterTaskList.map((item: ITask, index: number) => (
      <Task
        item={item}
        key={index}
        removeTodo={removeTodo}
        handleChecked={handleChecked}
        editTodo={editTodo}
        handleClickOpen={handleClickOpen}
      />
    ));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ width: 500, margin: '0 auto' }}
    >
      <Grid item>
        <h1>todos</h1>
      </Grid>
      {todo.length > 0 ? (
        <Grid item>
          <Input
            {...register('search')}
            placeholder="Search..."
            onChange={(e) => setSearchKeyword(e.target.value)}
            sx={{ width: '100%' }}
          />
          {filterTaskList.length > 0 ? (
            renderTaskList()
          ) : (
            <Grid
              container
              sx={{ width: 400, height: 100 }}
              justifyContent="center"
              alignItems="center"
            >
              No result...
            </Grid>
          )}
          <Pagination count={5} color="primary" sx={{ float: 'right' }} />
        </Grid>
      ) : (
        <>
          <Grid item>
            <ListAltIcon sx={{ fontSize: 75 }} />
          </Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <h2>Add your first todo</h2>
            <p>What do you want to get done today?</p>
          </Grid>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('inputTodo')} placeholder="E.g. Build a web app" />
        <Button type="submit">Submit</Button>
      </form>
    </Grid>
  );
};
