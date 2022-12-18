import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';
import styles from './Login.module.scss';

export const Login = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: { email: '', password: '' },
		mode: 'onChange',
	});

	if (isAuth) {
		return <Navigate to={'/'} />;
	}

	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values));
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		} else {
			alert('Не удалось авторизоваться');
		}
	};

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					type="text"
					label="E-Mail"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					fullWidth
					{...register('email', { required: 'Укажите почту' })}
				/>
				<TextField
					className={styles.field}
					type="password"
					label="Пароль"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					fullWidth
					{...register('password', { required: 'Укажите пароль' })}
				/>
				<Button type="submit" size="large" variant="contained" fullWidth>
					Войти
				</Button>
			</form>
		</Paper>
	);
};
