import { validationResult } from 'express-validator';

export default (req, res, next) => {
	const err = validationResult(req);
	if (!err.isEmpty()) return res.status(401).json(err.errors);
	next();
};
