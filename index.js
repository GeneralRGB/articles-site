import express from 'express';
import mongoose from 'mongoose';

import {
	registerValidator,
	postCreateValidation,
} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as userController from './controllers/userController.js';
import * as postController from './controllers/postController.js';

// Setting up db
mongoose
	.connect(
		'mongodb+srv://admin:pass@cluster0.mmqkfgh.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('Connected to db'))
	.catch((err) => console.log('Error while connecting to db: ', err));

const app = express();

// Enabling JSON support
app.use(express.json());

// Processing login request
app.post('/auth/login', userController.login);

// Retrieving profile information
app.get('/profile', checkAuth, userController.profileInfo);

// Processing register request
app.post('/auth/register', registerValidator, userController.register);

// Creating post
app.post('/posts', checkAuth, postCreateValidation, postController.create);

// Getting all posts
app.get('/posts', postController.getAll);

// Getting one
app.get('/posts/:id', postController.getOne);

// Updating post
app.patch('/posts/:id', checkAuth, postController.update);

// Deleting post
app.delete('/posts/:id', checkAuth, postController.remove);

// Processing 404 request
app.all('*', (req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Starting server
app.listen(3000, (error) => {
	if (error) return console.log(error);
	console.log('Server listening on port 3000');
});
