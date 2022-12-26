import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useNavigate, Navigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import axios, { API_URL } from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);

	const [title, setTitle] = React.useState('');
	const [tags, setTags] = React.useState('');
	const [text, setText] = React.useState('');
	const [imageUrl, setImageUrl] = React.useState('');
	// eslint-disable-next-line no-unused-vars
	const [loading, setIsLoading] = React.useState(false);

	const isEditing = Boolean(id);

	const inputFileRef = React.useRef(null);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			formData.append('image', event.target.files[0]);
			const { data } = await axios.post('/upload', formData, {
				headers: { 'Content-Type': 'image' },
			});
			console.log(data.url);
			setImageUrl(data.url);
		} catch (err) {
			console.warn(err);
		}
	};

	React.useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(({ data }) => {
				setTitle(data.title);
				setTags(data.tags.join(', '));
				setText(data.text);
				setImageUrl(data.imageUrl);
			});
		}
	}, [id]);

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onSubmit = async () => {
		try {
			setIsLoading(true);
			const fields = {
				title,
				tags,
				imageUrl,
				text,
			};
			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields);
			const _id = isEditing ? id : data._id;
			navigate(`/posts/${_id}`);
		} catch (err) {
			console.warn(err);
			alert('Ошибка при создании статьи!');
		}
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	if (!localStorage.getItem('token') && !isAuth) {
		return <Navigate to={'/'} />;
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant="outlined"
				size="large"
			>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type="file"
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`${API_URL}${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Заголовок статьи..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Тэги"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href="/">
					<Button size="large">Отмена</Button>
				</a>
			</div>
		</Paper>
	);
};
