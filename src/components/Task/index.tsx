import React, { useState } from 'react';

import {
  Button,
  List,
  ListItem,
  IconButton,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Grid,
  Input,
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { theme } from '../../theme';
import { ITask } from '../../App';
import { useForm } from 'react-hook-form';

interface IProps {
  item: ITask;
  removeTodo: any;
  handleChecked: any;
  editTodo: any;
  handleClickOpen: any;
}

interface IInput {
  edit: string;
}

const Task = ({
  item,
  removeTodo,
  handleChecked,
  editTodo,
  handleClickOpen,
}: IProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { edit: item.inputTodo },
  });

  const onSubmit = (data: IInput) => {
    console.log(data);

    editTodo({ id: item.id, value: data.edit, callback: () => setEdit(false) });
  };

  return (
    <List sx={{ width: 400 }} key={item.id}>
      <ListItem
        divider
        secondaryAction={
          edit ? (
            <Grid container spacing={2}>
              <Grid item>
                <IconButton
                  edge="end"
                  aria-label="confirm"
                  type="submit"
                  form="form-edit"
                >
                  <CheckIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  edge="end"
                  aria-label="cancel"
                  onClick={() => setEdit(false)}
                >
                  <CloseIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(true);
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleClickOpen()}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          )
        }
      >
        {edit ? (
          <form id="form-edit" onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('edit')} fullWidth />
          </form>
        ) : (
          <FormGroup>
            <FormControlLabel
              control={<Checkbox onClick={() => handleChecked(item.id)} />}
              label={
                <Typography
                  className={item.status ? theme.typography.textDecoration : ''}
                >
                  {item.inputTodo}
                </Typography>
              }
            />
          </FormGroup>
        )}
      </ListItem>
    </List>
  );
};

export default Task;
