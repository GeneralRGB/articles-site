import { validationResult } from 'express-validator';

export default (req, res, next) => {
	const err = validationResult(req);
	if (!err.isEmpty()) return response.status(401).json(err.errors);
	next();
};
