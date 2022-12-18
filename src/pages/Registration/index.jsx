import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, fetchRegister } from '../../redux/slices/auth';

import styles from './Login.module.scss';

export const Registration = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	const {
		register,
		handleSubmit,
		// вытащить и прикрутить ошибки с помощью setError
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: 'Иван Иванов',
			email: 'Ivanov@gmail.com',
			password: '12345',
		},
		mode: 'onChange',
	});

	if (isAuth) {
		return <Navigate to={'/'} />;
	}

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values));
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		} else {
			alert('Не удалось зарегистрироваться');
		}
	};

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
					type="text"
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Укажите полное имя' })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="E-Mail"
					type="text"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите почту' })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Пароль"
					type="text"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль' })}
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
