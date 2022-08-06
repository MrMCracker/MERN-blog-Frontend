import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuth, fetchRegister } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import {useForm} from "react-hook-form";

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
      register,
      handleSubmit,
      formState: { errors, isValid }
  } = useForm({
      defaultValues: {
          fullName: "",
          email: '',
          password: '',
      },
      mode: 'all'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    console.log(data)

    if (!data.payload) {
        return alert("Не удалось зарегистрироваться!1");
    }

    if ('token' in data.payload) {
        window.localStorage.setItem('token', data.payload.token)
    } else {
        alert("Не удалось зарегистрироваться!");
    }
  }
  if (isAuth) {
      return <Navigate to='/'/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
            className={styles.field}
            label="Полное имя"
            error={Boolean(errors.fullName?.message)}
            helperText={errors.fullName?.message}
            {...register('fullName', { required: 'Укажите полное имя' })}
            fullWidth
        />
        <TextField
            className={styles.field}
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            {...register('email', { required: 'Укажите email' })}
            type={'email'}
            fullWidth
        />
        <TextField
            className={styles.field}
            label="Пароль"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', { required: 'Укажите пароль' })}
            fullWidth
        />
          <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
              Зарегистрироваться
          </Button>
      </form>

    </Paper>
  );
};
