import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
	registerValidator,
	postCreateValidation,
	loginValidator,
} from './validations/validations.js';
import { postController, userController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

// Setting up db
mongoose
	.connect(
		'mongodb+srv://admin:pass@cluster0.mmqkfgh.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('Connected to db'))
	.catch((err) => console.log('Error while connecting to db: ', err));

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

const app = express();

// Disable cors
app.use(cors());

// Enabling JSON support
app.use(express.json());

// Allow to get images from server via link
app.use('/uploads', express.static('uploads'));

// Processing login request
app.post(
	'/auth/login',
	loginValidator,
	handleValidationErrors,
	userController.login
);

// Retrieving profile information
app.get('/profile', checkAuth, userController.profileInfo);

// Processing register request
app.post(
	'/auth/register',
	registerValidator,
	handleValidationErrors,
	userController.register
);

// Creating post
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	postController.create
);

// Getting all posts
app.get('/posts', postController.getAll);

// Getting one post
app.get('/posts/:id', postController.getOne);

// Updating post
app.patch(
	'/posts/:id',
	checkAuth,
	handleValidationErrors,
	postController.update
);

// Deleting post
app.delete(
	'/posts/:id',
	checkAuth,
	handleValidationErrors,
	postController.remove
);

// Uploading picture
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

// Processing 404 request
app.all('*', (_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Starting server
app.listen(4444, (error) => {
	if (error) return console.log(error);
	console.log('Server is listening on port 4444');
});
