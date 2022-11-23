import { body } from 'express-validator';

export const registerValidator = [
	body('email', 'Wrong email format').isEmail(),
	body('password', 'Password minimum length should be 5').isLength({ min: 5 }),
	body('fullName', 'Full name length should be at least 3').isLength({
		min: 3,
	}),
	body('avatarUrl', 'Wrong URL').optional().isURL(),
];

export const loginValidator = [
	body('email', 'Wrong email format').isEmail(),
	body('password', 'Password minimum length should be 5').isLength({ min: 5 }),
];

export const postCreateValidation = [
	body('title', 'Enter post title').isLength({ min: 5 }).isString(),
	body('text', 'Enter post text').isLength({ min: 10 }).isString(),
	body('tags', 'Wrong tag format (Should be an array)').optional().isArray(),
	body('imageUrl', 'Wrong link').optional().isURL(),
];
