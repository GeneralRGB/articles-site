import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import userModel from '../models/user.js';

export const login = async (request, response) => {
	try {
		const user = await userModel.findOne({ email: request.body.email });
		if (!user) return response.status(400).json({ message: 'User not found' });

		const isPasswordValid = await bcrypt.compare(
			request.body.password,
			user._doc.passwordHash
		);

		if (!isPasswordValid)
			return response.status(400).json({ message: 'Wrong login or password' });

		const token = jwt.sign({ _id: user._id }, 'Pony', { expiresIn: '30d' });

		const { passwordHash, ...userData } = user._doc;

		return response.json({ success: true, userData, token });
	} catch (error) {
		console.log(error);
		return response.status(401).json({ error: "Couldn't authorize" });
	}
};

export const profileInfo = async (req, res) => {
	const user = await userModel.findById(req.userId);

	if (!user) return res.status(404).json({ message: 'User not found' });

	const { passwordHash, ...userData } = user._doc;
	return res.status(200).json({ ...userData });
};

export const register = async (request, response) => {
	try {
		const password = request.body.password;
		const sault = await bcrypt.genSalt(10);
		const hash = bcrypt.hashSync(password, sault);

		const doc = new userModel({
			email: request.body.email,
			fullName: request.body.fullName,
			passwordHash: hash,
			avatarUrl: request.body.avatarUrl,
		});

		const createdUser = await doc.save();
		const { passwordHash, ...userData } = createdUser._doc;

		const token = jwt.sign({ _id: createdUser._id }, 'Pony', {
			expiresIn: '30d',
		});

		response.json({ success: true, userData, token });
	} catch (error) {
		console.log(error);
		response.status(500).json({
			message: 'Could not register new user',
		});
	}
};
