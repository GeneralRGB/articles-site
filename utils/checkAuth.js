import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (!token) return res.status(401).send('Unauthorized');

	try {
		const decoded = jwt.verify(token, 'Pony', { complete: false });
		req.userId = decoded._id;
		next();
	} catch (err) {
		console.log(err);
		return res.status(403).json({ message: 'Wrong token' });
	}
};
