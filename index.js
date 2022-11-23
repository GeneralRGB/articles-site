import express from 'express';
import mongoose from 'mongoose';

import { registerValidator } from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as userController from './controllers/userController.js';

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

// Processing 404 request
app.all('*', (req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Starting server
app.listen(3000, (error) => {
	if (error) return console.log(error);
	console.log('Server listening on port 3000');
});
